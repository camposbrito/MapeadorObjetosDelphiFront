import './MapeadorDataModule.css';
import {Container, Row, Col, Image, Table, Button, Modal }  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Mps from './images/mps.png'
import Papa from 'papaparse';
import relacaoFormsClassesObjetos from './text/relacao_forms_classes_objetos.csv'
import { Link } from 'react-router-dom';

const MapeadorDataModule = () => {  

    const [dados, setDados] = useState([]);

    useEffect(() => {
        Papa.parse(relacaoFormsClassesObjetos, {
          download: true,
          header: false,
          skipEmptyLines: true,
          complete: (resultado) => {
            const dadosSemCabecalho = resultado.data.slice(1).map((linha) => {
              return linha.map((celula) => {
                return celula.replace('Objeto:', '').replace('Tipo:', '').trim();
              });
            });
            console.log(dadosSemCabecalho);
            setDados(dadosSemCabecalho);
          }
        });
      }, []);

    const [filtro, setFiltro] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const cellStyle = {
        wordBreak: 'break-word',
        maxWidth: '350px',
        overflow: 'hidden',
        whiteSpace: 'normal'
    };

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
  
    const formatModalContent = (content) => {
        const blocks = content.split(/(?:StoredProcName:|SQL.Query:)/).filter(Boolean);
        return blocks.map((block, index) => {
          const trimmedBlock = block.trim().replace(/\|\s*$/, ''); 
          const prefix = index > 0 ? (trimmedBlock.startsWith('dbo.') ? 'StoredProcName: ' : 'SQL.Query: ') : '';
          const fullText = `${prefix}${trimmedBlock}`;
          return (
            <div key={index} style={{ marginBottom: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                <CopyToClipboard text={fullText}
                    onCopy={() => console.log('Texto copiado!')}>
                        <button>
                            <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="svg octicon-copy" width="16" height="16" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg></span>
                        </button>
                </CopyToClipboard>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>{fullText}</code>
              </pre>
            </div>
          );
        });
      };
      

  return (
    
    <Container fluid style={{ backgroundColor: 'white'}}>
        <Navbar id='inicio' expand="lg" style={{ backgroundColor: '#98FB98'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                    <Navbar.Brand>
                        <Image src={Mps} alt="Logo" style={{ maxHeight: '15vh', marginRight: '10px'}} />
                    </Navbar.Brand>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                    <span className='fira-sans-condensed-black' style={{ fontSize: '35px', color: '#2b2928'}}>
                        Mapeador HomePar - PCL
                    </span>
                </Col>
            </Row>
        </Navbar>
        <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '10vh'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                <input
                    type="text"
                    placeholder="Filtrar..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{
                        borderRadius: '15px', 
                        border: '1px solid #ced4da', 
                        padding: '0.375rem 0.75rem', 
                        outline: 'none', 
                        transition: 'border-color 0.15s ease-in-out', 
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = '#198754')} 
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ced4da')} 
                />
 
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                   
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="success" style={{ width: '100px', height:'50px' }}>
                            Voltar
                        </Button>
                    </Link>
                </Col>
            </Row>    
        </Container>
            <Table striped bordered hover style={{ width: 'auto', margin: 'auto' }}>
                <thead style={{ backgroundColor: '#98FB98', color: 'white' }}>
                    <tr>
                        <th>Form</th>
                        <th>Classe</th>
                        <th>Objetos de Banco</th>
                    </tr>
                </thead>
                <tbody>
                    {dados
                        .filter((linha) => {
                            const [form, classe, ...objetosDeBanco] = linha;
                            const termoFiltrado = filtro.toLowerCase();
                            return (
                                form.toLowerCase().includes(termoFiltrado) ||
                                classe.toLowerCase().includes(termoFiltrado) ||
                                objetosDeBanco.some(objeto => objeto.toLowerCase().includes(termoFiltrado))
                            );
                        })
                        .map((linha, indexLinha) => {
                            const [form, classe, ...objetosDeBanco] = linha;
                            const objetosTiposConcatenados = objetosDeBanco
                                .flatMap(objetoDeBanco => typeof objetoDeBanco === 'string'
                                    ? objetoDeBanco.replace('Objeto: ', '').replace('Tipo: ', '').split(' | ')
                                    : []
                                )
                                .join(' | ');

                            return (
                                <React.Fragment key={indexLinha}>
                                    <tr>
                                        <td style={cellStyle}>{classe}</td>
                                        <td style={cellStyle}>{form}</td>
                                        <td style={cellStyle}>
                                            <Button
                                                variant="success"
                                                style={{ width: '70px', height: '50px' }}
                                                onClick={() => handleOpenModal(objetosTiposConcatenados || 'N/A')}
                                            >
                                                Ver
                                            </Button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes dos Objetos de Banco</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formatModalContent(modalContent)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        <Container style={{ minHeight: '10vh'}}></Container>
        <footer className="footer">
            <Container fluid >
                <p className="text-center mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default MapeadorDataModule;