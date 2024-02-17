import React from 'react';
import 'App.css';
import { Typography } from "~/components/ui/typography";
import { FaRegFaceTired } from "react-icons/fa6";
import { Button } from "~/components/ui/button"
import { useNavigate} from "react-router-dom";
import { TbError404 } from "react-icons/tb";


const NotFound = () => {
  const navigate = useNavigate()

    return (
        <>
        <div className='full-screen'>
          <div className='page-info-title-align'>
            <TbError404 size={200} color='red'/>
           </div>
           <div className='page-info-align'>
           <Typography variant="h2"><FaRegFaceTired style={{display: 'inline'}} /> PAGE NOT FOUND <FaRegFaceTired style={{display: 'inline'}}/></Typography>
           <div className='Subtitle-blank-40'></div>
            <Button variant="destructive" onClick={()=>{navigate("/")}}>GO HOME</Button>
           </div>
        </div>

        </>
    );
}

export default NotFound;