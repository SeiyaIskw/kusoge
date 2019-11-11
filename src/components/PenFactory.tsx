import React, { useState } from "react";
import Status from "./PenFactory/status/Status";
import PenBody from "./PenFactory/pen/PenBody";
import PenCap from "./PenFactory/pen/PenCap";
import Counter from "./PenFactory/Counter";
import Buttons from "./PenFactory/Buttons";
import ControlButtons from "./PenFactory/ControlButtons";

// TODO: 効果音、エフェクト関連（ボーナス、加算、ゲームオーバー）

const styles = () => ({
  position: "relative" as "relative",
  maxWidth: 1152,
  height: 700,
  margin: "auto"
});

const PenFactory: React.FC = () => {
  // states b: body, f: flip
  const [bodyStage, setBodyStage] = useState([
    { b: 0, f: false },
    { b: 1, f: false },
    { b: 2, f: false }
  ]);
  const [capStage, setCapStage] = useState([0]);
  const [count, setCount] = useState(0);
  const [money, setMoney] = useState(0);
  const [lives, setLife] = useState(3);
  const [unitPrice, setUnitPrice] = useState(0.5);
  const [chanceRate, setChanceRate] = useState(1);

  const handleKeyDown = (e: any) => {
    if (e.key === " ") {
      handleLanePush();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      handleCap();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      handleFlip();
    }
  };

  const validatePen = () => {
    // ちゃんとキャップがついているか判断
    const currentPen = bodyStage.findIndex(i => i.b === 2);
    const isCapped = capStage.indexOf(1);

    if (bodyStage[currentPen].f === false && isCapped !== -1) {
      setCount(count + 1);
      setMoney(money + unitPrice);
      validateBonus();
    } else {
      setLife(lives - 1);
    }
  };

  const pushPenBody = () => {
    // 最後の本体を消す
    const findDeadBody = bodyStage.findIndex(i => i.b === 4);
    console.log(findDeadBody);

    if (findDeadBody !== -1) bodyStage.splice(findDeadBody, 1);
    // 本体を進める
    setBodyStage(
      bodyStage.map(i => {
        return { b: i.b += 1, f: i.f };
      })
    );
    //新しい本体を持ってくる
    setBodyStage([...bodyStage, { b: 0, f: Math.random() >= 0.4 }]);
  };

  const pushCapBody = () => {
    // 画面外のキャップを消去する
    const findDeadCap = capStage.indexOf(3);
    if (findDeadCap !== -1) capStage.splice(findDeadCap, 1);
    // キャップを進める
    setCapStage(capStage.map(i => (i === 0 ? 0 : i + 1)));
    // 新しいキャップを持ってくる
    if (capStage.indexOf(0) === -1) setCapStage([...capStage, 0]);
  };

  const handleLanePush = () => {
    if (lives <= 0) {
      console.log("GAME OVER");
      return;
    }
    validatePen();
    pushPenBody();
    pushCapBody();
  };

  const handleCap = () => {
    //キャップのつけ外し
    setCapStage(capStage.map(i => (i === 0 ? 1 : i === 1 ? 0 : i)));
  };

  //TODO: キャップ状態で回転させない
  const handleFlip = () => {
    //くるくる回る
    setBodyStage(
      bodyStage.map(i => (i.b !== 2 ? { b: i.b, f: i.f } : { b: i.b, f: !i.f }))
    );
  };

  const validateBonus = () => {
    const rollBonus = Math.floor(Math.random() * 101) <= chanceRate;
    if (rollBonus) {
      const bonus = Math.floor(Math.random() * 50 + 20) * unitPrice;
      setMoney(money + bonus);
    }
  };

  // 強化メニュー、保留
  const isEnoughMoney = {
    unitPrice: false,
    bonus: false,
    life: false
  };

  return (
    <section>
      <div style={styles()} onKeyDown={handleKeyDown} tabIndex={0}>
        <Status
          money={money}
          lives={lives}
          chanceRate={chanceRate}
          unitPrice={unitPrice}
        />

        {capStage.map((num, index) => (
          <PenCap key={index + count} stage={num} />
        ))}
        {bodyStage.map((num, index) => (
          <PenBody key={index + count} stage={num.b} isPenFlipped={num.f} />
        ))}
        <ControlButtons
          buttons={{
            LanePush: handleLanePush,
            Cap: handleCap,
            Flip: handleFlip
          }}
        />
        <Counter count={count} />
      </div>
      <Buttons isEnoughMoney={isEnoughMoney} />
    </section>
  );
};

export default PenFactory;
