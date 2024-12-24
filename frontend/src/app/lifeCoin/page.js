'use client'
import Layout from "../../components/layout/Layout"
import Service from "../../components/lifecoin/Services"
import WhyChooseUs from "../../components/home/WhyChooseUs"
import Link from "next/link"
import { getTopLifeCoinHolders } from "@/src/components/utils/lifeCoinsWeb3"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
    const [topHolders, setTopHolders] = useState([])
    const [topCoins, setCoins] = useState([])

    useEffect(() => {
        const fetchLifeCoins = async () => {
            try {
                const response = await getTopLifeCoinHolders()
                console.log("Fetched results ",response[0]);
                setCoins(response[1]);
                //call api localHost:8000//staff/:publicAddress1/:publicAddress2/:publicAddress3 
                //where publicAddress1 is response[0] and publicAddress2 is response[1]
                //and publicAddress3 is response[2]
                const data = await axios.get(`http://localhost:8000/staff/${response[0][0]}/${response[0][1]}/${response[0][2]}`);
                console.log(data);

                console.log("Dat----",data.data.data[0]["image"]);

                setTopHolders(data.data.data)
            } catch (error) {
                alert(`Error fetching LifeCoins: ${error.message}`)
            }
        }

        fetchLifeCoins()
    }, [])

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <section className="service-section sec-pad" id="service">
                    <div className="auto-container">

                    <p>
                            Welcome to the world of **LifeCoin**, a heartfelt tribute to the selfless heroes—our doctors, nurses, and healthcare professionals—who dedicate their lives to caring for us without hesitation. LifeCoin is more than just a digital currency; it’s a celebration of the compassion, courage, and tireless efforts of those who put our health above their own comfort, often sacrificing precious moments with their families to save ours. By honoring their invaluable contributions, LifeCoin inspires a culture of gratitude and respect for these everyday heroes. Join us in celebrating their noble deeds and showing your support for those who work tirelessly to heal, protect, and uplift humanity. Together, let’s build a future where kindness and service are rewarded, and the spirit of selflessness shines brighter than ever.
                            </p>
                            
                        <div className="sec-title mb_50 centred">
                            <span className="sub-title">Top Life Savers</span>
                            <h2>Meet our heroes of the month</h2>
                        </div>
                        <div className="row clearfix">
                            {topHolders.length > 0 ? (
                                topHolders.map((holder, index) => (
                                    <div className="col-lg-4 col-md-6 col-sm-12 service-block" key={index}>
                                        <div
                                            className="service-block-one wow fadeInUp animated"
                                            data-wow-delay={`${index * 300}ms`}
                                            data-wow-duration="1500ms"
                                        >
                                            <div className="inner-box">
                                                <div className="image-box">
                                                    <figure className="image">
                                                        <img
                                                            src={holder.image}
                                                            alt={`Top Holder ${index + 1}`}
                                                        />
                                                    </figure>
                                                    <div className="icon-box"><i className="icon-15"></i></div>
                                                </div>
                                                <div className="lower-content">
                                                    <h3>Life Saver {index + 1}</h3>
                                                    <p>Name: {holder.name} </p>
                                                    <p>email: {holder.email} </p>
                                                    <p>LifeCoins: {topCoins[index]} </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="centred">Loading top holders...</p>
                            )}

                            
                        </div>
                    </div>
                </section>
                <WhyChooseUs />
            </Layout>
        </>
    )
}
