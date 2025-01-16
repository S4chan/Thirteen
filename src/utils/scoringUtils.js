import { evaluateHand } from "./utils";

/**
 * 計算每回合的分數，並返回分數陣列
 * @param {Array} results - 所有回合的結果，包含每個回合的牌型資訊
 * @returns {Array} 分數陣列
 */
export const calculateScores = (results) => {
  if (!Array.isArray(results) || results.length === 0) return []; // 無效輸入或無記錄時返回空陣列

  return results.map((round) => {
    const { hands } = round;

    if (!Array.isArray(hands) || hands.length !== 3) {
      console.error("Invalid round data:", round);
      return 0; // 若資料結構不正確，回傳 0 分
    }

    const [front, middle, back] = hands;

    // 加堵分數
    let bonus = 0;

    try {
      if (evaluateHand(middle.hand) === "四條") bonus += 8;
      if (evaluateHand(back.hand) === "四條") bonus += 4;
      if (evaluateHand(middle.hand) === "同花順") bonus += 10;
      if (evaluateHand(back.hand) === "同花順") bonus += 5;
      if (evaluateHand(front.hand) === "三條") bonus += 3;
    } catch (error) {
      console.error("Error evaluating hand:", error);
      return 0; // 跳過該回合，避免程式中斷
    }

    // 計算基本分數 (假設可以根據應用需求調整)
    let score = 0;

    try {
      const frontHand = evaluateHand(front.hand);
      const middleHand = evaluateHand(middle.hand);
      const backHand = evaluateHand(back.hand);

      if (frontHand !== middleHand || middleHand !== backHand) {
        score = 1; // 假設不同牌型得 1 分
      } else {
        score = 0; // 平手不加分
      }
    } catch (error) {
      console.error("Error evaluating hand for score calculation:", error);
      score = 0; // 錯誤時回傳 0 分
    }

    return score + bonus; // 返回該回合的分數與加堵分數
  });
};

/**
 * 對撲克牌進行排序
 * @param {Array} hand - 撲克牌陣列，例如 [['S', 2], ['H', 13]]
 * @returns {Array} 已排序的撲克牌陣列
 */
export const sortHand = (hand) => {
  if (!Array.isArray(hand)) {
    console.error("Invalid hand data:", hand);
    return []; // 無效輸入返回空陣列
  }

  return hand.sort((a, b) => a[1] - b[1]);
};
