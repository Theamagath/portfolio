import { For, Index, Show, createSignal, onCleanup, untrack, createContext, useContext } from 'solid-js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, db, contentRef } from './firebase';
import { contentSchema, defaults, type Content } from './data/content';
import './admin.css';
import { experienceGroups } from './data/experience';

const labels: Record<string, string> = { name: 'Nama', shortName: 'Nama singkat', role: 'Profesi', location: 'Lokasi', shortBio: 'Bio singkat', about: 'Tentang saya', aboutSecond: 'Paragraf lanjutan', email: 'Email', photo: 'Foto utama', introPhoto: 'Foto intro', aboutPhoto: 'Foto tentang', navbarPhoto: 'Foto navigasi', footerPhoto: 'Foto footer', resume: 'URL CV', social: 'Media sosial', title: 'Judul', category: 'Kategori', group: 'Kelompok pengalaman', year: 'Tahun', summary: 'Ringkasan', description: 'Deskripsi', stack: 'Teknologi', image: 'URL sampul', gallery: 'Galeri', publication: 'Publikasi', link: 'Tautan', src: 'URL gambar', alt: 'Keterangan gambar', organization: 'Organisasi', period: 'Periode', documentation: 'URL dokumentasi', highlights: 'Poin pengalaman', number: 'Nomor', desc: 'Deskripsi', tags: 'Keahlian', label: 'Label', url: 'URL', visual: 'Ilustrasi cadangan', id: 'ID' };
const blankProject = { id: 0, title: '', category: 'Web App', year: '', summary: '', description: '', stack: [], visual: 'website', image: '', gallery: [], publication: '', link: '' };
const templates: Record<string, unknown> = { projects: blankProject, experiences: { group: 'Profesional', id: '', documentation: '', gallery: [], category: '', title: '', organization: '', period: '', description: '', link: '', highlights: [] }, expertise: { number: '', title: '', desc: '', tags: [] }, social: { label: '', url: '' }, gallery: { src: '', alt: '' } };
const editable = (data: Content): Content => ({ ...data, projects: data.projects.map(p => ({ ...blankProject, ...p })) });

const sections: Record<keyof Content, { title: string; description: string; icon: string }> = {
  profile: { title: 'Profil & kontak', description: 'Perkenalkan dirimu dan tentukan cara pengunjung menghubungimu.', icon: '01' },
  projects: { title: 'Karya & proyek', description: 'Tambahkan karya, jelaskan peranmu, dan lengkapi gambar pendukung.', icon: '02' },
  experiences: { title: 'Pengalaman', description: 'Ceritakan pengalaman kerja, organisasi, dan kegiatanmu.', icon: '03' },
  expertise: { title: 'Keahlian', description: 'Kelompokkan kemampuan dan alat yang kamu kuasai.', icon: '04' },
};
const hints: Record<string, string> = {
  group: 'Pilih Profesional untuk magang atau pekerjaan, dan Organisasi untuk kegiatan organisasi.',
  shortName: 'Nama pendek yang ditampilkan pada identitas portofolio.',
  shortBio: 'Ringkasan perkenalan di halaman utama.',
  summary: 'Ringkasan singkat yang tampil di kartu karya.',
  description: 'Ceritakan konteks, peran, proses, dan hasilnya.',
  photo: 'Contoh: /foto-saya.jpg atau https://contoh.com/foto.jpg',
  resume: 'Tautan file PDF untuk tombol unduh CV. Boleh dikosongkan.',
  image: 'Tautan gambar utama karya. Boleh dikosongkan.',
  introPhoto: 'Opsional. Kosongkan untuk memakai foto utama.',
  aboutPhoto: 'Opsional. Kosongkan untuk memakai foto utama.',
  navbarPhoto: 'Opsional. Kosongkan untuk memakai foto utama.',
  footerPhoto: 'Opsional. Kosongkan untuk memakai foto utama.',
  gallery: 'Tambahkan tautan gambar dan keterangannya satu per satu.',
  stack: 'Tambahkan satu teknologi atau alat pada setiap item.',
  tags: 'Tambahkan satu keahlian atau alat pada setiap item.',
  social: 'Tautan akun media sosial yang ingin kamu tampilkan.',
  highlights: 'Tambahkan pencapaian atau tanggung jawab utama.',
  publication: 'Nama jurnal atau penerbit. Kosongkan untuk karya biasa.',
  year: 'Contoh: 2026. Boleh dikosongkan.',
};
const collectionNames: Record<string, string> = { projects: 'karya', experiences: 'pengalaman', expertise: 'kelompok keahlian', social: 'media sosial', gallery: 'gambar', stack: 'teknologi', tags: 'keahlian', highlights: 'poin' };
const longFields = ['description', 'about', 'aboutSecond', 'shortBio', 'summary', 'desc'];
const EditorActivity = createContext<(delta: number) => void>(() => {});

function CollectionEditor(props: { name: string; value: unknown[]; change: (value: unknown[]) => void }) {
  const activity = useContext(EditorActivity);
  const [childEditors, setChildEditors] = createSignal(0);
  const [editing, setEditing] = createSignal<number | null>(null);
  const [itemDraft, setItemDraft] = createSignal<any>({});
  const [itemError, setItemError] = createSignal('');
  onCleanup(() => { if (editing() !== null) activity(-1); });
  let origin: HTMLElement | undefined;
  let panel: HTMLDivElement | undefined;
  const itemName = () => collectionNames[props.name] || 'item';
  const title = (item: any) => String(item?.title || item?.label || item?.alt || 'Belum diberi nama');
  const begin = (index: number | null, event: MouseEvent) => {
    origin = event.currentTarget as HTMLElement;
    let value: any = index === null ? structuredClone(templates[props.name]) : structuredClone(props.value[index]);
    if (index === null && props.name === 'projects') value.id = Math.max(0, ...props.value.map((v: any) => v.id)) + 1;
    if (index === null && props.name === 'experiences') value.id = crypto.randomUUID();
    if (editing() === null) activity(1);
    setItemDraft(value); setItemError(''); setEditing(index === null ? -1 : index);
    queueMicrotask(() => { panel?.scrollIntoView({ block: 'nearest', behavior: 'auto' }); panel?.querySelector<HTMLInputElement>('input, select, textarea')?.focus(); });
  };
  const close = () => { if (editing() !== null) activity(-1); setEditing(null); queueMicrotask(() => origin?.isConnected && origin.focus()); };
  const apply = () => {
    const value = itemDraft();
    const required = props.name === 'social' ? 'label' : props.name === 'gallery' ? 'src' : 'title';
    if (!String(value[required] || '').trim()) { setItemError('Isi ' + (labels[required] || required).toLowerCase() + ' terlebih dahulu.'); return; }
    props.change(editing() === -1 ? [...props.value, value] : props.value.map((old, index) => index === editing() ? value : old));
    close();
  };
  return <EditorActivity.Provider value={delta => { setChildEditors(count => count + delta); activity(delta); }}><section class="cms-managed-collection" aria-label={itemName()}>
    <Show when={editing() !== null} fallback={<>
      <div class="cms-list-heading"><div><h3>{labels[props.name] || sections[props.name as keyof Content]?.title || 'Daftar item'} <span class="cms-count">{props.value.length}</span></h3><p>{hints[props.name] || 'Setiap item memiliki formulir edit sendiri.'}</p></div><button class="cms-publish" type="button" onClick={event => begin(null, event)}>+ Tambah {itemName()}</button></div>
      <Show when={!props.value.length}><div class="cms-empty">Belum ada {itemName()}. Klik Tambah untuk mengisi item pertama.</div></Show>
      <Index each={props.value}>{(item, index) => <article class="cms-list-row"><span class="cms-item-number">{String(index + 1).padStart(2, '0')}</span><div class="cms-row-title"><strong>{title(item())}</strong><small>{String((item() as any)?.group || (item() as any)?.category || (item() as any)?.url || '')}</small></div><div class="cms-row-actions"><button type="button" disabled={index === 0} aria-label={'Pindah ' + title(item()) + ' ke atas'} onClick={() => { const next = [...props.value]; [next[index-1], next[index]] = [next[index], next[index-1]]; props.change(next); }}>Naik</button><button type="button" onClick={event => begin(index, event)}>Edit</button><button type="button" class="cms-delete" onClick={() => { if (confirm('Hapus ' + title(item()) + ' dari draf?')) props.change(props.value.filter((_, i) => i !== index)); }}>Hapus</button></div></article>}</Index>
    </>}>
      <div class="cms-single-editor" ref={panel}><header><span class="cms-editor-badge">{editing() === -1 ? 'ITEM BARU' : 'EDIT ITEM'}</span><h3>{editing() === -1 ? 'Tambah ' + itemName() : 'Edit ' + itemName()}</h3><p>Isi formulir khusus item ini, lalu klik Simpan item ke draf. Batal akan membuang perubahan pada formulir ini.</p></header><div class="cms-single-fields"><Field name={props.name + 'Item'} value={itemDraft()} change={setItemDraft}/></div><Show when={itemError()}><p class="cms-item-error" role="alert">{itemError()}</p></Show><footer><p>{childEditors() > 0 ? 'Selesaikan formulir di dalam item ini terlebih dahulu.' : 'Setelah selesai, klik Simpan & terbitkan di halaman utama untuk memperbarui website.'}</p><div><button type="button" disabled={childEditors() > 0} onClick={() => { if (confirm('Tutup formulir dan buang perubahan item ini?')) close(); }}>Batal</button><button type="button" class="cms-publish" disabled={childEditors() > 0} onClick={apply}>Simpan item ke draf</button></div></footer></div>
    </Show>
  </section></EditorActivity.Provider>;
}

function Field(props: { name: string; value: unknown; change: (v: any) => void }) {
  const array = () => props.value as unknown[];
  const object = () => props.value as Record<string, unknown>;
  const updateKey = (key: string, next: unknown) => props.change({ ...object(), [key]: next });
  const basicKeys = () => Object.keys(object()).filter(key => !['id', 'visual', 'introPhoto', 'aboutPhoto', 'navbarPhoto', 'footerPhoto'].includes(key));
  const advancedKeys = () => Object.keys(object()).filter(key => ['id', 'visual', 'introPhoto', 'aboutPhoto', 'navbarPhoto', 'footerPhoto'].includes(key));
  return <Show when={Array.isArray(props.value)} fallback={
    <Show when={props.value !== null && typeof props.value === 'object'} fallback={
      <label class={'cms-field ' + (longFields.includes(props.name) ? 'cms-field-wide' : '')}><span>{labels[props.name] || 'Isi item'}</span>
        <Show when={props.name === 'category' && ['Web App', 'UI/UX', 'Desain Grafis', 'Publikasi'].includes(String(props.value)) || props.name === 'visual' || props.name === 'group'} fallback={
          <Show when={longFields.includes(props.name)} fallback={<input type={typeof props.value === 'number' ? 'number' : props.name === 'email' ? 'email' : 'text'} value={String(props.value ?? '')} onInput={e => props.change(typeof props.value === 'number' ? Number(e.currentTarget.value) : e.currentTarget.value)} />}>
            <textarea rows={4} value={String(props.value ?? '')} onInput={e => props.change(e.currentTarget.value)} />
          </Show>
        }><select value={String(props.value)} onChange={e => props.change(e.currentTarget.value)}><For each={props.name === 'group' ? [...experienceGroups] : props.name === 'visual' ? ['website', 'dashboard', 'mobile', 'branding', 'analytics'] : ['Web App', 'UI/UX', 'Desain Grafis', 'Publikasi']}>{v => <option>{v}</option>}</For></select></Show>
        <Show when={hints[props.name]}><small>{hints[props.name]}</small></Show>
      </label>
    }><div class="cms-grid"><For each={basicKeys()}>{key => <Field name={key} value={object()[key]} change={next => updateKey(key, next)} />}</For>
      <Show when={advancedKeys().length}><details class="cms-advanced"><summary>Pengaturan tambahan <span>ID, ilustrasi, atau foto per bagian</span></summary><div class="cms-grid"><For each={advancedKeys()}>{key => <Field name={key} value={object()[key]} change={next => updateKey(key, next)} />}</For></div></details></Show>
    </div></Show>
  }>
    <Show when={!!templates[props.name]} fallback={<fieldset class="cms-collection"><legend>{labels[props.name] || sections[props.name as keyof Content]?.title || 'Daftar item'} <span class="cms-count">{array().length}</span></legend>
      <Show when={hints[props.name]}><p class="cms-help">{hints[props.name]}</p></Show>
      <Show when={!array().length}><div class="cms-empty">Belum ada {collectionNames[props.name] || 'item'}. Klik tombol tambah di bawah untuk mulai mengisi.</div></Show>
      {/* Initialize once; typing must not close a manually opened editor. */}
      <Index each={array()}>{(item, index) => <details class="cms-item" open={untrack(() => typeof item() !== 'object')}><summary><span class="cms-item-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{String((item() as any)?.title || (item() as any)?.label || (item() as any)?.alt || (typeof item() === 'string' && item()) || 'Item baru')}</strong><small>{String((item() as any)?.category || (item() as any)?.organization || 'Klik untuk mengedit')}</small></span><span class="cms-edit-label">Edit</span></summary><div class="cms-item-body"><div class="cms-item-actions"><button type="button" disabled={index === 0} onClick={() => { const next = [...array()]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; props.change(next); }}>Pindah ke atas</button><button type="button" class="cms-delete" onClick={() => { if (confirm('Hapus item ini dari draf?')) props.change(array().filter((_, i) => i !== index)); }}>Hapus item</button></div><Field name={props.name + 'Item'} value={item()} change={next => props.change(array().map((v, i) => i === index ? next : v))} /></div></details>}</Index>
      <button class="cms-add" type="button" onClick={event => { const item = structuredClone(templates[props.name] ?? ''); if (props.name === 'projects') (item as any).id = Math.max(0, ...array().map(v => (v as any).id)) + 1; if (props.name === 'experiences') (item as any).id = crypto.randomUUID(); const parent = event.currentTarget.parentElement; props.change([...array(), item]); queueMicrotask(() => { const last = parent?.querySelector<HTMLDetailsElement>(':scope > details:last-of-type'); if (last) { last.open = true; last.querySelector<HTMLInputElement>('input')?.focus(); } }); }}>+ Tambah {collectionNames[props.name] || 'item'}</button>
    </fieldset>}><CollectionEditor name={props.name} value={array()} change={props.change}/></Show>
  </Show>;
}

export default function Admin() {
  const [openEditors, setOpenEditors] = createSignal(0);
  const [user, setUser] = createSignal<User | null>(null);
  const [ready, setReady] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [allowed, setAllowed] = createSignal(false);
  const [draft, setDraft] = createSignal<Content>(editable(structuredClone(defaults)));
  const [tab, setTab] = createSignal<keyof Content>('profile');
  const [busy, setBusy] = createSignal(false);
  const [loaded, setLoaded] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);
  const [message, setMessage] = createSignal('');
  let revision = 0;
  let email = '', password = '';
  const error = (e: unknown) => { const code = (e as { code?: string }).code; setMessage(code === 'permission-denied' ? 'Akses ditolak. Pastikan UID akun terdaftar di admins dan Security Rules sudah dipasang.' : code?.startsWith('auth/') ? `Login gagal (${code}). Periksa akun dan pengaturan Authentication.` : e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.'); };
  const load = async () => {
    setLoaded(false); setBusy(true);
    try {
      const snapshot = await getDoc(contentRef);
      revision = snapshot.data()?.revision ?? 0;
      setDraft(editable(snapshot.exists() ? contentSchema.parse(snapshot.data()) : structuredClone(defaults)));
      setDirty(false); setLoaded(true);
      setMessage(snapshot.exists() ? 'Konten siap diedit.' : 'Database belum berisi konten. Periksa draf awal lalu klik Simpan & terbitkan.');
    } catch (e) { error(e); } finally { setBusy(false); }
  };
  const stop = onAuthStateChanged(auth, async current => {
    setUser(current); setAllowed(false); setReady(false); setLoaded(false);
    try {
      if (current) {
        const admin = await getDoc(doc(db, 'admins', current.uid));
        if (auth.currentUser?.uid !== current.uid) return;
        const enabled = admin.exists() && admin.data().enabled === true;
        setAllowed(enabled);
        if (enabled) await load();
      }
    } catch (e) { error(e); } finally { setReady(true); }
  });
  const beforeUnload = (e: BeforeUnloadEvent) => { if (dirty() || openEditors() > 0) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', beforeUnload);
  onCleanup(() => { stop(); window.removeEventListener('beforeunload', beforeUnload); });
  const save = async () => {
    setBusy(true); setMessage('Menyimpan…');
    try {
      const parsed = contentSchema.safeParse(draft());
      if (!parsed.success) throw new Error(parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n'));
      await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(contentRef);
        if ((snapshot.data()?.revision ?? 0) !== revision) throw new Error('Konten berubah dari sesi lain. Salin perubahanmu lalu muat ulang konten.');
        transaction.set(contentRef, { ...parsed.data, revision: revision + 1 });
      });
      revision++; setDirty(false); setMessage('Berhasil dipublikasikan. Portofolio sudah diperbarui.');
    } catch (e) { error(e); } finally { setBusy(false); }
  };
  return <EditorActivity.Provider value={delta => setOpenEditors(count => count + delta)}><main class="cms"><aside class="cms-sidebar"><a class="cms-brand" href="/admin"><span class="cms-brand-icon">P</span><span>Portfolio<small>Panel pengelola</small></span></a><p class="cms-nav-caption">KELOLA KONTEN</p><nav aria-label="Bagian konten"><For each={Object.entries(sections)}>{([key, section]) => <button aria-pressed={tab() === key} disabled={openEditors() > 0 || busy()} onClick={() => setTab(key as keyof Content)}><span>{section.icon}</span>{section.title}<Show when={key !== 'profile'}><b>{(draft()[key as 'projects' | 'experiences' | 'expertise']).length}</b></Show></button>}</For></nav><div class="cms-sidebar-tip"><strong>Cara memperbarui</strong><p>1. Pilih bagian konten.<br/>2. Edit atau tambah item.<br/>3. Klik Simpan & terbitkan.</p><small>Perubahan baru tampil di website setelah disimpan.</small></div><a class="cms-view-site" href="/" target="_blank" rel="noopener">Buka portofolio</a></aside><div class="cms-workspace"><header class="cms-header"><div><small>DASHBOARD / KONTEN WEBSITE</small><h1>{sections[tab()].title}</h1><p>{sections[tab()].description}</p></div><a href="/" target="_blank" rel="noopener">Lihat portofolio ↗</a></header>
    <p class="cms-status" role="status">{message()}</p>
    <Show when={ready()} fallback={<p>Memeriksa sesi…</p>}>
      <Show when={user()} fallback={<form class="cms-login" onSubmit={async e => { e.preventDefault(); setBusy(true); try { await signInWithEmailAndPassword(auth, email, password); password = ''; } catch (e) { error(e); } finally { setBusy(false); } }}><h2>Masuk sebagai admin</h2><label>Email<input type="email" autocomplete="username" required onInput={e => email = e.currentTarget.value}/></label><label for="admin-password">Sandi</label><div class="cms-password"><input id="admin-password" type={showPassword() ? 'text' : 'password'} autocomplete="current-password" required onInput={e => password = e.currentTarget.value}/><button type="button" class="cms-password-toggle" aria-controls="admin-password" aria-pressed={showPassword()} onClick={() => setShowPassword(value => !value)}>{showPassword() ? 'Sembunyikan' : 'Lihat sandi'}</button></div><button disabled={busy()}>Masuk</button></form>}>
        <div class="cms-account"><span>{user()?.email}</span><button disabled={busy() || openEditors() > 0} onClick={async () => { if (dirty() && !confirm('Keluar dan buang draf yang belum disimpan?')) return; try { await signOut(auth); setDirty(false); setMessage(''); } catch (e) { error(e); } }}>Keluar</button></div>
        <Show when={allowed()} fallback={<p>Akun ini belum memiliki akses admin. Daftarkan UID <code>{user()?.uid}</code> melalui Firebase Console.</p>}>
          <div class="cms-toolbar"><div class="cms-save-state"><span classList={{ 'cms-state-dot': true, 'is-dirty': dirty() }}/><div><strong>{dirty() ? 'Perubahan belum disimpan' : 'Konten siap diedit'}</strong><small>{openEditors() > 0 ? 'Selesaikan formulir: Simpan item ke draf atau Batal.' : dirty() ? 'Simpan agar perubahan tampil di portofolio.' : 'Pilih item di bawah untuk mulai mengedit.'}</small></div></div><div class="cms-save-actions"><button disabled={busy() || openEditors() > 0} onClick={() => { if (!dirty() || confirm('Buang draf dan muat ulang konten?')) void load(); }}>Muat ulang</button><button class="cms-publish" disabled={busy() || !loaded() || openEditors() > 0} onClick={save}>{busy() ? 'Memproses...' : 'Simpan & terbitkan'}</button></div></div>
          <Show when={loaded()}><div class="cms-section-note"><strong>{tab() === 'profile' ? 'Informasi yang tampil di website' : 'Daftar ' + sections[tab()].title.toLowerCase()}</strong><p>{tab() === 'profile' ? 'Isi identitas dan kontakmu. Foto tambahan boleh dikosongkan untuk memakai foto utama.' : 'Klik Tambah atau Edit untuk membuka formulir satu item. Simpan item ke draf, lalu Simpan & terbitkan untuk memperbarui website.'}</p><small>Untuk gambar dan CV, tempel tautan file atau gunakan path seperti /foto.jpg. Upload file belum tersedia.</small></div><fieldset disabled={busy()} class="cms-editor"><Field name={tab()} value={draft()[tab()]} change={value => { setDraft(previous => ({ ...previous, [tab()]: value })); setDirty(true); }} /></fieldset><div class="cms-bottom-save"><div><strong>{dirty() ? 'Selesai menambahkan atau mengedit?' : 'Tidak ada perubahan yang belum disimpan.'}</strong><p>{openEditors() > 0 ? 'Klik Simpan item ke draf pada formulir terlebih dahulu.' : 'Simpan semua perubahan untuk menampilkannya di portofolio.'}</p></div><button type="button" class="cms-publish" disabled={busy() || !loaded() || !dirty() || openEditors() > 0} onClick={save}>{busy() ? 'Menyimpan...' : 'Simpan & terbitkan'}</button><Show when={message()}><p class="cms-bottom-message" role="status">{message()}</p></Show></div></Show>
        </Show>
      </Show>
    </Show>
  </div></main></EditorActivity.Provider>;
}
