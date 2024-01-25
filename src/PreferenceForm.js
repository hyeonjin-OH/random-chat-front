import { Button } from "~/components/ui/button"


function PreferenceForm(){
  return(
    <>
          <div>
            <h3>레이드 구간</h3>
            {
            /* <div><input type="checkbox" value="a"/>1415~1444</div>
            <div><input type="checkbox" value="b"/>1445~1489</div>
            <div><input type="checkbox" value="c"/>1490~1519</div>
            <div><input type="checkbox" value="d"/>1520~1539</div>
            <div><input type="checkbox" value="e"/>1540~1579</div>
            <div><input type="checkbox" value="f"/>1580~1599</div>
            <div><input type="checkbox" value="g"/>1600~1609</div>
            <div><input type="checkbox" value="h"/>1610~1619</div>
            <div><input type="checkbox" value="i"/>1620~</div> */
            }
            <div><input type="checkbox" value="a"/>모코코</div>
            <div><input type="checkbox" value="b"/>발탄</div>
            <div><input type="checkbox" value="c"/>비아키스</div>
            <div><input type="checkbox" value="d"/>쿠크세이튼</div>
            <div><input type="checkbox" value="e"/>노말 아브렐슈드</div>
            <div><input type="checkbox" value="f"/>하드 아브렐슈드</div>
            <div><input type="checkbox" value="g"/>노말 카양겔</div>
            <div><input type="checkbox" value="h"/>하드 카양겔</div>
            <div><input type="checkbox" value="i"/>노말 일리아칸</div>
            <div><input type="checkbox" value="j"/>하드 일리아칸</div>
            <div><input type="checkbox" value="k"/>노말 상아탑</div>
            <div><input type="checkbox" value="l"/>하드 상아탑</div>
            <div><input type="checkbox" value="m"/>노말 카멘</div>
            <div><input type="checkbox" value="n"/>하드 카멘</div>
            <div><input type="checkbox" value="o"/>노말 에키드나</div>
            <div><input type="checkbox" value="p"/>하드 에키드나</div>
            
          </div>
          <div>
            <h3> 선호 포지션</h3>
            <input type="checkbox" value="d"/>딜러
            <input type="checkbox" value="s"/>서폿
          </div>
          <div>
            <h3>선호 시간대</h3>
            <input type="checkbox"/>하루종일
            <input type="checkbox"/>저녁시간
          </div>
          <div>
            <h3>선호 없음</h3>
            <input type="checkbox"/>아무나
          </div>
          <div style={{margin: 10}}>
          </div>
          <button>선호 매칭 설정 변경</button>
          <Button variant="outline">Button</Button>


        </>
  )
}

export default PreferenceForm;