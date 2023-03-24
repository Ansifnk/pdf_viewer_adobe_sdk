import React from 'react'
import PdfReader from '../components/PdfReader'
import SamplePdf from '../assets/sample.pdf'
const Home = () => {
    return (
            <PdfReader className="pdfReader" url={SamplePdf} />
    )
}

export default Home