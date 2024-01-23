function PreferenceForm(){
  return(
    <>
          <div>
            <h3>레벨 구간</h3>
            <div><input type="checkbox" value="a"/>1415~1444</div>
            <div><input type="checkbox" value="b"/>1445~1489</div>
            <div><input type="checkbox" value="c"/>1490~1519</div>
            <div><input type="checkbox" value="d"/>1520~1539</div>
            <div><input type="checkbox" value="e"/>1540~1579</div>
            <div><input type="checkbox" value="f"/>1580~1599</div>
            <div><input type="checkbox" value="g"/>1600~1609</div>
            <div><input type="checkbox" value="h"/>1610~1619</div>
            <div><input type="checkbox" value="i"/>1620~</div>
            
          </div>
          <div>
            <h3> 선호 포지션</h3>
            <input type="checkbox" value="d"/>딜러
            <input type="checkbox" value="s"/>서폿
          </div>
          <div>
            <h3>선호 시간대</h3>
            <input type="checkbox"/>A
            <input type="checkbox"/>B
          </div>   
        </>
  )
}

export default PreferenceForm;