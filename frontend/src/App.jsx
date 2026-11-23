import { useEffect, useRef, useState } from 'react';
import { profile as fallbackProfile, projects as fallbackProjects } from './fallback.js';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(fallbackProfile));
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => setProjects(fallbackProjects));
  }, []);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const value = total > 0 ? doc.scrollTop / total : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${value})`;
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setStatus(response.ok ? 'Mensaje enviado' : 'Revisa los datos del formulario');
    if (response.ok) form.reset();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (!profile) {
    return <main><p className="loading">Cargando portafolio…</p></main>;
  }

  return (
    <main>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      <nav className="nav">
        <a className="logo" href="#inicio">RZ<span>.</span></a>
        <div className="nav-links">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#formacion">Formación</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#objetivos">Objetivos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      <header id="inicio" className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <img className="photo" src={profile.photo} alt={`Foto de ${profile.name}`} />
        <div className="hero-copy">
          <p className="eyebrow">Portafolio profesional · Sucre, Bolivia</p>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <div className="badges">
            <span className="available"><i aria-hidden="true" />{profile.availability}</span>
            <span>{profile.age} años</span>
            <span>{profile.semester}</span>
            <span>{profile.english}</span>
            <span>{profile.location}</span>
          </div>
          <div className="hero-actions">
            <a className="btn primary" href="#proyectos">Ver proyectos</a>
            <a className="btn ghost" href="#contacto">Contactarme</a>
          </div>
          <div className="stats">
            <div><strong>{profile.age}</strong><span>Años</span></div>
            <div><strong>{profile.semester.split(' ')[0]}</strong><span>Semestre</span></div>
            <div><strong>{String(projects.length).padStart(2, '0')}</strong><span>Proyectos</span></div>
            <div><strong>B2</strong><span>Inglés</span></div>
          </div>
        </div>
      </header>

      <section id="sobre-mi" className="section reveal">
        <h2 className="section-title"><span>01</span> Sobre mí</h2>
        <div className="about-grid">
          <div className="about-text">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="fact-card">
            <h3>Perfil</h3>
            <ul>
              <li><strong>Edad</strong><br />{profile.age} años</li>
              <li><strong>Carrera</strong><br />{profile.career}</li>
              <li><strong>Formación</strong><br />{profile.semester} · {profile.university}</li>
              <li><strong>Inglés</strong><br />{profile.english}</li>
              <li><strong>Ubicación</strong><br />{profile.location}</li>
            </ul>
          </aside>
        </div>
        <div className="approach">
          {profile.approach.map((item, index) => (
            <article className="approach-card" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="formacion" className="section reveal">
        <h2 className="section-title"><span>02</span> Formación</h2>
        <article className="education-card">
          <div className="education-icon" aria-hidden="true">🎓</div>
          <div>
            <p className="education-status">{profile.education.status}</p>
            <h3>{profile.education.degree}</h3>
            <p className="education-school">{profile.education.school}</p>
            <p className="education-detail">{profile.education.location} · {profile.education.focus}</p>
          </div>
        </article>
      </section>

      <section id="habilidades" className="section reveal">
        <h2 className="section-title"><span>03</span> Habilidades</h2>
        <div className="skills">
          {profile.skills.map((skill) => (
            <article className="skill-card" key={skill.title}>
              <h3>{skill.title}</h3>
              <ul className="tag-list">
                {skill.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="proyectos" className="section reveal">
        <h2 className="section-title"><span>04</span> Proyectos</h2>
        <div className="projects">
          {projects.map((project, index) => (
            <article className="project-card" key={project.id} data-testid="project-card">
              <span className="project-index">PROYECTO {String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.url} target="_blank" rel="noreferrer">
                Ver más <span className="arrow">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="objetivos" className="section reveal">
        <h2 className="section-title"><span>05</span> Objetivos a futuro</h2>
        <ul className="goals">
          {profile.goals.map((goal) => <li key={goal}>{goal}</li>)}
        </ul>
      </section>

      <section id="contacto" className="section reveal">
        <h2 className="section-title"><span>06</span> Contacto</h2>
        <div className="contact-layout">
          <div className="contact-info">
            <p>
              Puedes escribirme a <strong>{profile.email}</strong> o dejarme un mensaje
              aquí. Estoy abierto a proyectos, colaboraciones y nuevas oportunidades.
            </p>
            <div className="contact-actions">
              <a className="btn primary" href={`mailto:${profile.email}`}>Escribirme</a>
              <button className="btn ghost copy-btn" type="button" onClick={copyEmail}>
                {copied ? 'Correo copiado' : 'Copiar correo'}
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" type="text" required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />

            <label htmlFor="message">Mensaje</label>
            <textarea id="message" name="message" rows="4" required />

            <button type="submit">Enviar mensaje</button>
            {status && <p className="status" data-testid="contact-status">{status}</p>}
          </form>
        </div>
      </section>

      <footer>
        © 2026 Rodrigo Zeballos Isita · Estudiante en Ingeniería de Sistemas Informáticos.
      </footer>
    </main>
  );
}
