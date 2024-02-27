/* eslint-disable */
import 'App.css';
import 'app/globals.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {instance, instanceE} from 'api/axiosApi'
import {useNavigate} from 'react-router-dom'
import { Button } from "~/components/ui/button"
import { Input700 } from "~/components/ui/input"
import {setCookie, getCookie, removeCookie} from "app/cookie"
import { Typography } from "~/components/ui/typography"
import { useToast } from "~/components/ui/use-toast"
import { Toaster } from "~/components/ui/toaster"

function Logout(){

  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await instanceE.get("/logout");

        removeCookie("accessToken");

        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [navigate]);

  return null; // 렌더링할 내용이 없으므로 null을 반환합니다.
}

export {Logout}