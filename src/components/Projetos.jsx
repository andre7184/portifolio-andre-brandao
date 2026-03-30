import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data/portfolioData';

// --- COMPONENTE: POPUP DE DETALHES (Renderização Condicional) ---
const PopupDetalhes = ({ project, onClose }) => {
  if (!project || !project.longDescription) return null;
  return (
    <AnimatePresence>
      <motion.div style={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div style={{...styles.modal, maxWidth: '500px'}} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>Informações detalhadas</h2>
            <button onClick={onClose} style={styles.closeButton}>&times;</button>
          </div>
          <div style={{ padding: '1rem 0' }}>
            <h3 style={{ color: '#fff', marginBottom: '10px', fontFamily: '"Audiowide", sans-serif' }}>{project.title}</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1rem' }}>{project.longDescription}</p>
          </div>
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button onClick={onClose} style={{...styles.btnAction, maxWidth: '100px'}}>Fechar</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- COMPONENTE DO POPUP GALERIA ---
const PopupGaleria = ({ project, onClose }) => {
  if (!project || !project.images || project.images.length === 0) return null;
  const totalImages = project.images.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const proximaImagem = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % totalImages); };
  const imagemAnterior = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages); };

  return (
    <AnimatePresence mode="wait">
      <motion.div style={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div style={styles.modal} initial={{ y: "-50px", opacity: 0 }} animate={{ y: "0", opacity: 1 }} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <div>
              <h2 style={styles.modalTitle}>{project.title}</h2>
              <div style={styles.paginationText}>Imagem {currentIndex + 1} de {totalImages}</div>
            </div>
            <button onClick={onClose} style={styles.closeButton}>&times;</button>
          </div>
          <div style={styles.imageContainer}>
            {totalImages > 1 && <button onClick={imagemAnterior} style={{...styles.navButton, left: '10px'}}>&#10094;</button>}
            <motion.img key={currentIndex} src={project.images[currentIndex]} style={styles.projectImage} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} />
            {totalImages > 1 && <button onClick={proximaImagem} style={{...styles.navButton, right: '10px'}}>&#10095;</button>}
          </div>
          {totalImages > 1 && (
            <div style={styles.dotsContainer}>
              {project.images.map((_, index) => (
                <span key={index} onClick={() => setCurrentIndex(index)} style={{...styles.dot, backgroundColor: index === currentIndex ? '#4377ef' : '#555'}} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Projetos({ filtro, setFiltro }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailProject, setDetailProject] = useState(null);

  const projetosExibidos = useMemo(() => {
    let filtrados = PROJECTS;
    if (filtro) {
      filtrados = PROJECTS.filter(proj => proj.tags.some(tag => tag.toLowerCase().includes(filtro.toLowerCase())));
    }
    return filtrados.slice(0, 12); 
  }, [filtro]);

  return (
    <section id="projetos" style={styles.section}>
      <div className="content-container" style={styles.containerCenter}>
        <div style={styles.headerRow}>
          <h1 className="section-title">{filtro ? `Projetos: ${filtro.toUpperCase()}` : 'Projetos em Destaque'}</h1>
          {filtro && <button onClick={() => setFiltro(null)} style={styles.clearBtn}>✕ Limpar</button>}
        </div>
        
        <div style={styles.grid}>
          <AnimatePresence mode="popLayout">
            {projetosExibidos.map((project) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="notification" style={styles.miniCard}>
                
                <div style={styles.topContent}>
                  <div className="notititle" style={styles.miniTitle}>{project.title}</div>
                  <div style={styles.tags}>
                    {project.tags.map(tag => <span key={tag} style={styles.tag}>{tag}</span>)}
                  </div>
                </div>

                <div style={styles.bottomContent}>
                  <div className="notibody" style={{...styles.miniBody, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {project.shortDescription || "Sem descrição disponível."}
                  </div>
                  
                  <div style={styles.buttonGroup}>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.btnAction}>GitHub</a>
                    )}
                    
                    {/* O BOTÃO SÓ APARECE SE EXISTIR DESCRIÇÃO */}
                    {project.longDescription && (
                      <button onClick={() => setDetailProject(project)} style={{...styles.btnAction, borderColor: '#00f2ff', color: '#00f2ff', background: 'none'}}>Detalhes</button>
                    )}
                    
                    {project.images?.length > 0 && (
                      <button onClick={() => setSelectedProject(project)} style={{...styles.btnAction, borderColor: '#ff00ff', color: '#ff00ff', background: 'none'}}>Fotos</button>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={styles.footerContainer}>
          <a href="https://github.com/andre7184" target="_blank" rel="noopener noreferrer" className="project-details-link">VER REPOSITÓRIO COMPLETO</a>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <PopupGaleria project={selectedProject} onClose={() => setSelectedProject(null)} />}
        {detailProject && <PopupDetalhes project={detailProject} onClose={() => setDetailProject(null)} />}
      </AnimatePresence>
    </section>
  );
}

const styles = {
  section: { padding: '4rem 0', backgroundColor: '#0d0d0d', display: 'flex', justifyContent: 'center' },
  containerCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  headerRow: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 350px))', gap: '1.5rem', width: '100%', justifyContent: 'center' },
  miniCard: { padding: '1.2rem', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', borderRadius: '1rem', gap: '0.5rem', position: 'relative' },
  topContent: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  bottomContent: { display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between' },
  miniTitle: { fontSize: '1.2rem', color: '#4377ef', padding: '0 0 0.5rem 0', textAlign: 'center', fontFamily: '"Audiowide", sans-serif', width: '100%'},
  miniBody: { fontSize: '0.9rem', color: '#99999d', padding: '0', textAlign: 'center', lineHeight: '1.4', marginBottom: '1rem' },
  tags: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px', marginBottom: '10px', width: '100%'},
  buttonGroup: { display: 'flex', gap: '6px', width: '100%', marginTop: 'auto', paddingTop: '0.5rem', justifyContent: 'center' },
  btnAction: { flex: 1, maxWidth: '110px', textAlign: 'center', fontSize: '0.7rem', padding: '8px 0', border: '1px solid #4377ef', color: '#4377ef', textDecoration: 'none', borderRadius: '4px', transition: '0.3s', fontFamily: '"Audiowide", sans-serif', cursor: 'pointer'},
  tag: { fontSize: '0.6rem', border: '1px solid rgba(67, 119, 239, 0.4)', padding: '1px 5px', borderRadius: '3px', color: '#4377ef' },
  clearBtn: { background: '#222', color: '#4377ef', border: '1px solid #4377ef', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' },
  footerContainer: { textAlign: 'center', marginTop: '2.5rem' },
  backdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' },
  modal: { width: '90%', maxWidth: '900px', backgroundColor: '#151515', borderRadius: '12px', padding: '1.5rem', border: '1px solid #4377ef', position: 'relative', overflow: 'hidden' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(67,119,239,0.3)', paddingBottom: '8px', marginBottom: '15px' },
  modalTitle: { fontFamily: '"Audiowide", sans-serif', color: '#4377ef', fontSize: '1rem', margin: 0 },
  closeButton: { background: 'none', border: 'none', color: '#ccc', fontSize: '2rem', cursor: 'pointer', lineHeight: '1' },
  imageContainer: { position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', maxHeight: '70vh', backgroundColor: '#000', borderRadius: '8px' },
  projectImage: { maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' },
  navButton: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10 },
  dotsContainer: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer' },
  paginationText: { color: '#aaa', fontSize: '0.8rem' }
};