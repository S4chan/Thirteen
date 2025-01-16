import { useState } from "react";
import { useForm } from "react-hook-form";
import HandSelector from "./HandSelector";
import ResultDisplay from "./ResultDisplay";
import { evaluateHand, compareHands } from "./utils/utils";

const App = () => {
  const { handleSubmit } = useForm();
  const [front, setFront] = useState([]); // 前牌
  const [middle, setMiddle] = useState([]); // 中牌
  const [back, setBack] = useState([]); // 後牌
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  // 驗證手牌是否符合要求
  const validateSelection = () => {
    if (front.length !== 3 || middle.length !== 5 || back.length !== 5) {
      setError("請確保前牌(3張)、中牌(5張)、後牌(5張)符合張數要求！");
      return false;
    }

    // 驗證牌型排列是否符合規則
    if (!compareHands(front, middle, back)) {
      setError(
        "牌型排列不符規則，前牌必須小於中牌，中牌必須小於後牌（相公）！"
      );
      return false;
    }

    setError(""); // 清除錯誤訊息
    return true;
  };

  // 確認按鈕的處理函數
  const handleConfirm = () => {
    if (!validateSelection()) return;

    const handResults = [
      { label: "前牌", hand: front, type: evaluateHand(front) },
      { label: "中牌", hand: middle, type: evaluateHand(middle) },
      { label: "後牌", hand: back, type: evaluateHand(back) },
    ];

    if (results.length >= 8) {
      setError("已達最多8次記錄限制!");
      return;
    }

    setResults((prev) => [
      ...prev,
      { id: prev.length + 1, hands: handResults },
    ]);
  };

  return (
    <div className="row mt-4 container">
      <div className="container col-md-6">
        <h1>撲克牌牌型判斷</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* 前牌 */}
        <HandSelector
          hand={front}
          setHand={setFront}
          maxLength={3}
          label="前牌(3張)"
        />
        {/* 中牌 */}
        <HandSelector
          hand={middle}
          setHand={setMiddle}
          maxLength={5}
          label="中牌(5張)"
        />
        {/* 後牌 */}
        <HandSelector
          hand={back}
          setHand={setBack}
          maxLength={5}
          label="後牌(5張)"
        />

        <button
          className="btn btn-primary mt-3"
          onClick={handleSubmit(handleConfirm)}
        >
          確認
        </button>
      </div>
      <div className="col-md-6">
        {/* 結果顯示 */}
        <ResultDisplay results={results} />
      </div>
    </div>
  );
};

export default App;
