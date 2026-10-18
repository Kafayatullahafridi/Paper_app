import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const initialPapers = [
  { id: 1, code: 'CS301', title: 'Data Structures & Algorithms', teacher: 'Dr. Ayesha Khan', year: 2024, semester: 'Fall', pages: 8, downloads: 248, tag: 'Popular', color: 'blue' },
  { id: 2, code: 'EE204', title: 'Digital Logic Design', teacher: 'Prof. Omar Farooq', year: 2023, semester: 'Spring', pages: 6, downloads: 174, tag: 'New', color: 'purple' },
  { id: 3, code: 'MG201', title: 'Principles of Marketing', teacher: 'Dr. Sara Ali', year: 2024, semester: 'Spring', pages: 5, downloads: 129, tag: '', color: 'orange' },
  { id: 4, code: 'CS205', title: 'Database Systems', teacher: 'Dr. Hamza Malik', year: 2022, semester: 'Fall', pages: 9, downloads: 98, tag: '', color: 'green' },
  { id: 5, code: 'MA101', title: 'Calculus I', teacher: 'Prof. Nadia Raza', year: 2024, semester: 'Fall', pages: 7, downloads: 302, tag: 'Popular', color: 'pink' },
  { id: 6, code: 'CS410', title: 'Artificial Intelligence', teacher: 'Dr. Bilal Ahmed', year: 2023, semester: 'Fall', pages: 10, downloads: 211, tag: '', color: 'indigo' },
];

const icons = {
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg>,
  upload: <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14"/></svg>,
  book: <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zm0 0A2.5 2.5 0 0 1 6.5 19H20"/></svg>,
  download: <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16"/></svg>,
  filter: <svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10m-7 6h4"/></svg>,
  arrow: <svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>,
  check: <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>,
  clock: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>,
  menu: <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
};

function App() {
  const [papers, setPapers] = useState(initialPapers);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('All years');
  const [subject, setSubject] = useState('All subjects');
  const [activeTab, setActiveTab] = useState('browse');
  const [showUpload, setShowUpload] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [toast, setToast] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [teacher, setTeacher] = useState('');
  const [sort, setSort] = useState('recent');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => papers.filter((paper) => {
    const matchesQuery = `${paper.title} ${paper.code} ${paper.teacher}`.toLowerCase().includes(query.toLowerCase());
    const matchesTeacher = !teacher || paper.teacher.toLowerCase().includes(teacher.toLowerCase());
    return matchesQuery && matchesTeacher && (year === 'All years' || String(paper.year) === year) && (subject === 'All subjects' || paper.code.startsWith(subject));
  }), [papers, query, year, subject, teacher]);

  const sortedPapers = useMemo(() => [...filtered].sort((a, b) => {
    if (sort === 'downloads') return b.downloads - a.downloads;
    if (sort === 'oldest') return a.year - b.year;
    return b.year - a.year;
  }), [filtered, sort]);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/api/papers`).then((response) => response.ok ? response.json() : []).then((data) => {
      if (Array.isArray(data) && data.length) setPapers(data);
    }).catch(() => {});
  }, []);

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3000); };
  const downloadPaper = async (paper) => {
    if (API_URL && paper._id) {
      window.open(`${API_URL}/api/papers/${paper._id}/download`, '_blank', 'noopener,noreferrer');
      return;
    }
    setPapers((current) => current.map((item) => item.id === paper.id ? { ...item, downloads: item.downloads + 1 } : item));
    notify(`${paper.code} download started`);
  };
  const resetFilters = () => { setQuery(''); setYear('All years'); setSubject('All subjects'); setTeacher(''); setSort('recent'); };
  const goToLibrary = () => { setActiveTab('browse'); setAdminMode(false); setMobileOpen(false); window.setTimeout(() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' }), 0); };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="nav-inner">
          <button className="brand" onClick={() => { setActiveTab('browse'); setAdminMode(false); }}>
            <span className="brand-mark">{icons.book}</span><span>paper<span className="brand-accent">trail</span></span>
          </button>
          <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            <button className={activeTab === 'browse' && !adminMode ? 'active' : ''} onClick={goToLibrary}>Browse papers</button>
            <button className={activeTab === 'how' ? 'active' : ''} onClick={() => { setActiveTab('how'); setAdminMode(false); setMobileOpen(false); }}>How it works</button>
            <button className="admin-link" onClick={() => { setAdminMode(true); setMobileOpen(false); }}>Admin portal <span className="admin-dot"/></button>
          </div>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileOpen((open) => !open)}>{icons.menu}</button>
          <button className="upload-button" onClick={() => setShowUpload(true)}>{icons.upload} Upload paper</button>
        </div>
      </nav>

      {adminMode ? <AdminView papers={papers} onApprove={(id) => { setPapers(papers.filter((paper) => paper.id !== id)); notify('Paper approved and published'); }} onExit={() => setAdminMode(false)} /> : activeTab === 'how' ? <HowItWorks /> : (
        <>
          <header className="hero">
            <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
            <div className="hero-content">
              <div className="eyebrow"><span className="spark">✦</span> The smarter way to study</div>
              <h1>Your next <em>great grade</em><br />starts here.</h1>
              <p>Find, share, and master past papers from your university.<br className="desktop-only" /> Built by students, for students.</p>
              <div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById('library').scrollIntoView({ behavior: 'smooth' })}>Explore the library {icons.arrow}</button><span className="student-count"><span className="avatars"><i>AK</i><i>HM</i><i>SR</i></span><span>Joined by <b>2,400+</b> students</span></span></div>
            </div>
            <div className="hero-card-wrap"><div className="floating-note note-left">✦ <b>Exam ready?</b><br/><span>You've got this.</span></div><div className="paper-preview"><div className="paper-topline">CS301 &nbsp;•&nbsp; FINAL EXAM</div><div className="paper-title">Data Structures<br />& Algorithms</div><div className="paper-line"/><div className="paper-meta"><span>FALL 2024</span><span>8 PAGES</span></div><div className="paper-scribble">∫ <small>log₂ n</small> dx</div><div className="paper-badge">A+</div></div><div className="floating-note note-right"><span className="tiny-check">{icons.check}</span><b>2,400+</b><br/><span>papers shared</span></div></div>
          </header>

          <main id="library" className="library">
            <div className="section-heading"><div><div className="section-kicker">THE LIBRARY</div><h2>Find exactly what you need.</h2><p>Search through verified papers from every corner of campus.</p></div><div className="library-stat"><b>1,248</b><span>papers available</span></div></div>
            <div className="search-row"><div className="search-box">{icons.search}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by subject, course code, or teacher..." /></div><select value={year} onChange={(event) => setYear(event.target.value)}><option>All years</option><option>2024</option><option>2023</option><option>2022</option></select><select value={subject} onChange={(event) => setSubject(event.target.value)}><option>All subjects</option><option value="CS">Computer Science</option><option value="EE">Electrical Engineering</option><option value="MA">Mathematics</option><option value="MG">Management</option></select><button className="filter-button" onClick={() => setShowFilters((open) => !open)}>{icons.filter}<span>{showFilters ? 'Hide filters' : 'More filters'}</span></button></div>
            {showFilters && <div className="extra-filters"><input value={teacher} onChange={(event) => setTeacher(event.target.value)} placeholder="Filter by teacher" /><button className="outline-button" onClick={resetFilters}>Clear filters</button></div>}
            <div className="results-head"><span>Showing <b>{sortedPapers.length}</b> of 1,248 papers</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Recently added</option><option value="oldest">Oldest first</option><option value="downloads">Most downloaded</option></select></div>
            <div className="paper-grid">{sortedPapers.map((paper) => <PaperCard key={paper.id || paper._id} paper={paper} onDownload={downloadPaper} onView={setSelectedPaper} />)}</div>
            {!filtered.length && <div className="empty-state">No papers match those filters. Try a different search.</div>}
            <div className="load-more"><button onClick={() => notify('You are all caught up — more papers are coming soon')}>Load more papers <span>↓</span></button></div>
          </main>
          <section className="contribute"><div><div className="section-kicker">GIVE BACK</div><h2>Have a paper to share?</h2><p>Help your classmates ace their exams. Every upload makes the library stronger.</p></div><button className="outline-button" onClick={() => setShowUpload(true)}>Share a paper {icons.arrow}</button></section>
          <footer><div className="brand footer-brand"><span className="brand-mark">{icons.book}</span><span>paper<span className="brand-accent">trail</span></span></div><span>Made for late nights & big dreams.</span><span>© 2024 PaperTrail</span></footer>
        </>
      )}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={(paper) => { setPapers([paper, ...papers]); setShowUpload(false); notify('Thanks! Your paper is waiting for admin approval.'); }} />}
      {selectedPaper && <PaperDetails paper={selectedPaper} onClose={() => setSelectedPaper(null)} onDownload={downloadPaper} />}
      {toast && <div className="toast">{icons.check}{toast}</div>}
    </div>
  );
}

function PaperCard({ paper, onDownload, onView }) {
  return <article className="paper-card" onClick={() => onView(paper)}><div className={`card-visual ${paper.color || 'blue'}`}><span className="course-code">{paper.code}</span>{paper.tag && <span className="paper-tag">{paper.tag}</span>}<div className="mini-paper"><span>{paper.semester.toUpperCase()} {paper.year}</span><b>{paper.title}</b><i>Question paper</i><div className="mini-lines"/></div><span className="page-count">{paper.pages} pages</span></div><div className="card-body"><h3>{paper.title}</h3><p>{paper.teacher}</p><div className="card-footer"><span>{paper.year} <i/> {paper.semester}</span><span className="download-count">{icons.download}{paper.downloads}</span><button aria-label={`Download ${paper.title}`} onClick={(event) => { event.stopPropagation(); onDownload(paper); }}>{icons.download}</button></div></div></article>;
}

function PaperDetails({ paper, onClose, onDownload }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal details-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={onClose}>×</button><div className="section-kicker">PAPER DETAILS</div><h2>{paper.title}</h2><p className="modal-subtitle">{paper.code} · {paper.teacher || 'Instructor not listed'}</p><div className="details-list"><span>Academic year<strong>{paper.year}</strong></span><span>Semester<strong>{paper.semester}</strong></span><span>Downloads<strong>{paper.downloads}</strong></span><span>Pages<strong>{paper.pages || '—'}</strong></span></div><button className="primary-button submit-button" onClick={() => onDownload(paper)}>{icons.download} Download paper</button></div></div>;
}

function UploadModal({ onClose, onUploaded }) {
  const [form, setForm] = useState({ title: '', code: '', teacher: '', year: '2024', semester: 'Fall' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.code || !file) return;
    setSubmitting(true);
    setError('');
    if (API_URL) {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append('file', file);
      try {
        const response = await fetch(`${API_URL}/api/papers`, { method: 'POST', body });
        if (!response.ok) throw new Error('Upload failed. Please try again.');
        onUploaded(await response.json());
      } catch (uploadError) {
        setError(uploadError.message);
        setSubmitting(false);
      }
      return;
    }
    onUploaded({ ...form, id: Date.now(), year: Number(form.year), pages: 1, downloads: 0, tag: 'Pending', color: 'blue' });
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" onClick={onClose}>×</button><div className="section-kicker">CONTRIBUTE</div><h2>Share a paper</h2><p className="modal-subtitle">Your upload will be reviewed by our team before it appears in the library.</p><form onSubmit={submit}><div className="form-grid"><label>Course code<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS301" /></label><label>Year<select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}><option>2024</option><option>2023</option><option>2022</option></select></label></div><label>Paper title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Data Structures & Algorithms" /></label><label>Teacher / lecturer<input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="e.g. Dr. Ayesha Khan" /></label><label className="dropzone"><input type="file" accept=".pdf,.jpg,.png" required onChange={(e) => setFile(e.target.files[0])} />{file ? <><b>{file.name}</b><span>Ready to upload</span></> : <><b>Drop your paper here or browse</b><span>PDF, JPG or PNG · Max 10MB</span></>}</label>{error && <p className="form-error">{error}</p>}<button className="primary-button submit-button" disabled={submitting} type="submit">{submitting ? 'Uploading...' : 'Submit for review'} {!submitting && icons.arrow}</button></form></div></div>;
}

function AdminView({ papers, onApprove, onExit }) {
  const pending = [{ id: 101, code: 'CS412', title: 'Machine Learning', teacher: 'Dr. Usman Tariq', year: 2024, semester: 'Fall', pages: 8, downloads: 0, color: 'indigo' }, { id: 102, code: 'PH101', title: 'Applied Physics', teacher: 'Prof. Iqra Shah', year: 2023, semester: 'Spring', pages: 6, downloads: 0, color: 'orange' }];
  return <main className="admin-page"><div className="admin-header"><div><button className="back-link" onClick={onExit}>← Back to library</button><div className="section-kicker">ADMIN PORTAL</div><h1>Keep the library brilliant.</h1><p>Review community uploads and keep PaperTrail trustworthy.</p></div><div className="admin-profile"><span>SA</span><div><b>Sarah Ahmed</b><small>Administrator</small></div></div></div><div className="admin-stats"><div><span className="stat-icon pending">{icons.clock}</span><b>02</b><small>Awaiting review</small></div><div><span className="stat-icon approved">{icons.check}</span><b>1,248</b><small>Published papers</small></div><div><span className="stat-icon upload">{icons.upload}</span><b>86</b><small>Uploads this month</small></div></div><section className="review-panel"><div className="panel-heading"><div><h2>Uploads awaiting review</h2><p>Check details before publishing to the student library.</p></div><span className="pending-label">2 pending</span></div>{pending.map((paper) => <div className="review-row" key={paper.id}><div className={`review-thumb ${paper.color}`}>{paper.code}</div><div className="review-info"><b>{paper.title}</b><span>{paper.code} · {paper.year} {paper.semester} · {paper.pages} pages</span><small>Submitted by <strong>{paper.teacher}</strong></small></div><button className="view-button">View paper</button><button className="approve-button" onClick={() => onApprove(paper.id)}>{icons.check} Approve</button><button className="decline-button">Decline</button></div>)}</section><section className="recent-panel"><div className="panel-heading"><div><h2>Recently published</h2><p>Latest papers visible to students.</p></div><button className="text-button">View all {icons.arrow}</button></div><div className="recent-list">{papers.slice(0, 3).map((paper) => <div className="recent-row" key={paper.id}><span className={`status-dot ${paper.color}`}/><b>{paper.title}</b><span>{paper.code}</span><span>{paper.year}</span><em>Published</em></div>)}</div></section></main>;
}

function HowItWorks() {
  return <main className="how-page"><div className="section-kicker">HOW IT WORKS</div><h1>Study smarter,<br /><em>together.</em></h1><p>PaperTrail turns years of exam knowledge into your unfair advantage.</p><div className="steps"><div><span>01</span><h2>Find your paper</h2><p>Search by subject, course code, lecturer, or year. Filters help you get to the right paper in seconds.</p></div><div><span>02</span><h2>Learn from the past</h2><p>Spot patterns, understand what matters, and walk into your exam with a clear plan.</p></div><div><span>03</span><h2>Pay it forward</h2><p>Upload your own papers after exams. Your future classmates will thank you.</p></div></div></main>;
}

createRoot(document.getElementById('root')).render(<App />);
