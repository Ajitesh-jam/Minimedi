import Layout from "../../components/layout/Layout"

import Service from "../../components/lifecoin/Services"

import WhyChooseUs from "../../components/home/WhyChooseUs"


export default function Home() {

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                
                <Service />
                <WhyChooseUs />
                
            </Layout>
        </>
    )
}