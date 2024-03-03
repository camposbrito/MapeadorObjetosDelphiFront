import './Mapeador.css';
import {Container, Row, Col, Image, Table, Button}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import Papa from 'papaparse';
import relacaoFormsSombrasObjetos from './text/relacao_forms_sombras_objetos.csv'
const Mapeador = () => {  

    const [dados, setDados] = useState([]);

    useEffect(() => {
        Papa.parse(relacaoFormsSombrasObjetos, {
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

  return (
    <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navbar id='inicio' expand="lg" style={{ backgroundColor: '#98FB98', minWidth: '100vh'}}>
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
        <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '10vh' }}>
            <input
                type="text"
                placeholder="Filtrar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />   
        </Container>
        <Table striped bordered hover  style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
            <thead style={{ backgroundColor: '#98FB98', color: 'white' }}>
                <tr>
                    <th>Form</th>
                    <th>Classe</th>
                    <th>Sombra</th>
                    <th>Objetos de Banco</th>
                </tr>
            </thead>
            <tbody>
                {dados
                    .filter((linha) => {
                        const [form, classe, sombra, ...objetosDeBanco] = linha;
                        const termoFiltrado = filtro.toLowerCase();
                        return (
                            form.toLowerCase().includes(termoFiltrado) ||
                            classe.toLowerCase().includes(termoFiltrado) ||
                            sombra.toLowerCase().includes(termoFiltrado) ||
                            objetosDeBanco.some(objeto => objeto.toLowerCase().includes(termoFiltrado))
                        );
                    })
                    .map((linha, indexLinha) => {
                        const [form, classe, sombra, ...objetosDeBanco] = linha;
                        const objetosTiposConcatenados = objetosDeBanco
                            .flatMap(objetoDeBanco => typeof objetoDeBanco === 'string'
                                ? objetoDeBanco.replace('Objeto: ', '').replace('Tipo: ', '').split(' | ')
                                : []
                            )
                            .join(' | ');

                        return (
                            <React.Fragment key={indexLinha}>
                                <tr>
                                    <td>{form}</td>
                                    <td>{classe}</td>
                                    <td>{sombra}</td>
                                    <td>{objetosTiposConcatenados || 'N/A'}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
            </tbody>

        </Table>
        <footer className="footer">
            <Container fluid>
                <p className="text-center mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default Mapeador;