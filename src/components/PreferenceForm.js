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
import { Toaster } from "~/components/ui/toaster"


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
  const [checkedRaidCount, setCheckedRaidCount] = useState(0);
  const [checkedRoleCount, setCheckedRoleCount] = useState(0);


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
      setRaid(response.data.preferRaid)
      setRole(response.data.preferRole)
      setTime(response.data.preferTime)
      setCheckedRaidCount(response.data.preferRaid.length)
      setCheckedRoleCount(response.data.preferRole.length)
      props.changePrefer(response.data)
    })
    .catch(error=>{
      console.log(error)
    });
  }, [location]);

  // 체크박스가 선택될 때마다 선택된 체크박스의 수를 업데이트합니다.
  const handleCheckboxChange = (checked, id, gubn) => {
    if(gubn === "raid"){
      const updatedCount = checked ? checkedRaidCount + 1 : checkedRaidCount - 1;
      setCheckedRaidCount(updatedCount);
    }
    else if(gubn === "role"){
      const updatedCount = checked ? checkedRoleCount + 1 : checkedRoleCount - 1;
      setCheckedRoleCount(updatedCount);
    }
  };

  let navigate = useNavigate();
  const onSubmit = (data)=>{
    
    data.uuId = userId;
    let tmp = JSON.stringify(data);
    instance(getCookie("accessToken"))
    .post("/api/v1/prefer", data)
    .then(function(response){
      if(props.changePrefer)
        props.changePrefer(response.data)
        navigate("/api/v1/waitingroom")
        toast({
          description: "선호 매칭 저장에 성공하였습니다.",
          duration: 1000,
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
                <Typography variant="h2"> 선호 레이드 </Typography>
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
                            disabled={checkedRaidCount >= 3 && !field.value.includes(item.id)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(checked, item.id, "raid")
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
                  <Typography variant="h2">찾는 포지션</Typography>
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
                              disabled={checkedRoleCount >= 1 && !field.value.includes(item.id)}
                              onCheckedChange={(checked) => {
                                handleCheckboxChange(checked, item.id, "role")
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
      </form>
      <Typography variant="p">* 보다 빠른 매칭을 위해 레이드는 최대 3개, 포지션은 1개만 선택 가능합니다.</Typography>
      <div className="Subtitle-blank-20">
        <Toaster />
      </div>
    </Form>
  )
}

export {PreferenceForm}