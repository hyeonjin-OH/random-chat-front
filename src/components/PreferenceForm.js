import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Typography } from "~/components/ui/typography"
import { Checkbox } from "~/components/ui/checkbox"
import {setCookie, getCookie} from 'app/cookie'
import {instance, instanceE} from 'api/axiosApi'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useToast } from "~/components/ui/use-toast"

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

const preferRaid =[
  {
    id: 1,
    label: "모코코",
  },
  {
    id: 2,
    label: "발탄",
  },
  {
    id: 3,
    label: "비아키스",
  },
  {
    id: 4,
    label: "쿠크세이튼",
  },
  {
    id: 5,
    label: "노말 아브렐슈드",
  },
  {
    id: 6,
    label: "하드 아브렐슈드",
  },
  {
    id: 7,
    label: "노말 카양겔",
  },
  {
    id: 8,
    label: "하드 카양겔",
  },
  {
    id: 9,
    label: "노말 일리아칸",
  },
  {
    id: 10,
    label: "하드 일리아칸",
  },
  {
    id: 11,
    label: "노말 상아탑",
  },
  {
    id: 12,
    label: "하드 상아탑",
  },
  {
    id: 13,
    label: "노말 카멘",
  },
  {
    id: 14,
    label: "하드 카멘",
  },
  {
    id: 15,
    label: "노말 에키드나",
  },
  {
    id: 16,
    label: "하드 에키드나",
  },
]

const preferRole = [
  {
    id: 100,
    label: "딜러",
  },
  {
    id: 101,
    label: "서폿",
  },
]

function PreferenceForm(props){

  const location = useLocation();
  const [pRaid, setRaid] = useState([]);
  const [pRole, setRole] = useState([]);
  const [pTime, setTime] = useState([]);
  const { toast } = useToast()
  
  const param = useParams();
  const userId = param.id;
  
  let form = useForm({
    defaultValues: {
      preferRaid: [],
      preferRole: [],
    },
    values:{
      preferRaid: pRaid,
      preferRole: pRole,
    },
  })

  useEffect(() => {
    instance(getCookie("accessToken")).
    get(location.pathname)
    .then(response =>{ 
      console.log("get PreferenceForm")
      console.log(response.data)
      setRaid(response.data.preferRaid)
      setRole(response.data.preferRole)
      setTime(response.data.preferTime)
    })
    .catch(error=>{
      console.log(error)
    });
  }, [location]);

  let navigate = useNavigate();
  const onSubmit = (data)=>{

    data.uuId = userId;
    let tmp = JSON.stringify(data);
    console.log("accessToken : " + getCookie("accessToken"))

    instance(getCookie("accessToken"))
    .post("/api/v1/prefer", data)
    .then(function(response){
        navigate("/api/v1/waitingroom")
        console.log("save success")
        toast({
          titile: "저장 성공",
          description: "선호 매칭 저장에 성공하였습니다.",
        })
    });
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="preferRaid"
          render={() => (
            <FormItem>
              <div className="mb-4 Subtitle-blank-40">
                { props.openedFlag=="Y" ? <Typography variant="h1">매칭 대기</Typography> 
                : <Typography variant="h1">선호 매칭 선택</Typography>}
              </div>
              <div className="preference-form-area">
              <div className="preference-form-box">
                <Typography variant="h2"> 레 이 드 </Typography>
                <div className="Set-center Subtitle-blank-10">
                {preferRaid.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="preferRaid"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row space-x-3 space-y-0 align-items-center"
                        >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                            />
                          </FormControl>
                          <Typography variant="p">
                            {item.label}
                          </Typography>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                </div>

                <div className="Subtitle-blank-40">
                  <Typography variant="h2">포 지 션</Typography>
                </div>

                <div className="Set-center Subtitle-blank-10">
                {preferRole.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="preferRole"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row space-x-3 space-y-0 align-items-center"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <Typography variant="p">
                            {item.label}
                          </Typography>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                </div>
              </div>
              </div>
            </FormItem>
          )}
        />
        { props.openedFlag ? <Button type="submit" variant="secondary">변경</Button> :  
        <Button type="submit" variant="secondary">저장</Button>}
        <div className="Subtitle-blank-20">
        </div>
      </form>
    </Form>
  )
}

export {PreferenceForm}