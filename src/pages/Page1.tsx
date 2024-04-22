import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";




const Page1 = ()=>{


    return(

        <>
           <Navbar/>

                <div className="h-screen w-full flex justify-center items-center">
                    <h1 className="text-5xl">Page 1</h1>
                </div>

           <Footer/>
        
        
        </>
    )
}

export default Page1;