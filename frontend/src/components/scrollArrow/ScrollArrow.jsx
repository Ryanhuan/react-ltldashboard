// import React from 'react'
import './scrollArrow.css'
import React, {useState} from 'react';

export default function ScrollArrow() {
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {    
        if (!showScroll && window.pageYOffset > 300){
           setShowScroll(true)    
        } else if (showScroll && window.pageYOffset <= 300){
           setShowScroll(false)    
        }  
     };

     const scrollTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
     };

     window.addEventListener('scroll', checkScrollTop)

  return (
    <div>
        <img src="/images/btmtop.png" alt="toTop" 
            className="scrollTop" 
            onClick={scrollTop} 
            style={{height: 40, display: showScroll ? 'flex' : 'none'}} />
    </div>
  )
}
