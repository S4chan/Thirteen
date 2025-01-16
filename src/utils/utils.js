export const suits = {
  S: "黑桃",
  H: "愛心",
  D: "方塊",
  C: "梅花",
};

export const Source_Poker = [];
for (const suit in suits) {
  for (let i = 1; i <= 13; i++) {
    Source_Poker.push([suit, i]);
  }
}

export const evaluateHand = (hand) => {
  // 自訂數字順序：A (1) 視為最大（14），2-10 不變，J=11, Q=12, K=13
  const cardValue = (card) => {
    const value = card[1];
    return value === 1 ? 14 : value; // Ace treated as the highest card (14)
  };

  const values = hand.map((card) => cardValue(card)).sort((a, b) => b - a); // 由大到小排序
  const valueCounts = values.reduce((counts, val) => {
    counts[val] = (counts[val] || 0) + 1;
    return counts;
  }, {});
  const counts = Object.values(valueCounts).sort((a, b) => b - a);

  // 判斷是否為順子，包含 A 為最小順子的特別判斷
  const isStraight = (() => {
    const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
    if (uniqueValues.length < 5) return false;
    // 一般順子檢查
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
      if (uniqueValues[i] - uniqueValues[i + 4] === 4) return true;
    }
    // A 為最小的順子 (5, 4, 3, 2, A)
    return (
      uniqueValues.includes(14) &&
      uniqueValues.slice(-4).toString() === "5,4,3,2"
    );
  })();

  const isFlush = hand.every((card) => card[0] === hand[0][0]);

  if (isFlush && isStraight) {
    // 判斷同花順的大小
    if (values.toString() === "14,13,12,11,10") {
      return { type: "皇家同花順", rank: 10 };
    } else if (
      values.includes(14) &&
      values.slice(-4).toString() === "5,4,3,2"
    ) {
      return { type: "同花順 5", rank: 9 };
    }
    return { type: `同花順 ${values[0]}`, rank: 9 };
  }

  if (counts[0] === 4)
    return {
      type: `四條 ${Object.keys(valueCounts).find(
        (key) => valueCounts[key] === 4
      )}`,
      rank: 8,
    };
  if (counts[0] === 3 && counts[1] === 2) return { type: "葫蘆", rank: 7 };
  if (isFlush) return { type: `同花 ${values[0]}`, rank: 6 };
  if (isStraight) {
    if (values.includes(14) && values.slice(-4).toString() === "5,4,3,2") {
      return { type: "順子 5", rank: 5 };
    }
    return { type: `順子 ${values[0]}`, rank: 5 };
  }
  if (counts[0] === 3)
    return {
      type: `三條 ${Object.keys(valueCounts).find(
        (key) => valueCounts[key] === 3
      )}`,
      rank: 4,
    };
  if (counts[0] === 2 && counts[1] === 2) return { type: "兩對", rank: 3 };
  if (counts[0] === 2)
    return {
      type: `一對 ${Object.keys(valueCounts).find(
        (key) => valueCounts[key] === 2
      )}`,
      rank: 2,
    };
  return { type: `高牌 ${values[0]}`, rank: 1 };
};

export const compareHands = (front, middle, back) => {
  const cardValue = (card) => {
    const value = card[1];
    return value === 1 ? 14 : value; // Ace treated as the highest card (14)
  };

  const frontResult = evaluateHand(front); // 前牌的牌型
  const middleResult = evaluateHand(middle); // 中牌的牌型
  const backResult = evaluateHand(back); // 後牌的牌型

  // 若前牌出現非法牌型，直接返回 false
  if (!["高牌", "一對", "三條"].includes(frontResult.type)) {
    return false; // 前牌牌型非法
  }

  // 比較兩副牌
  const compareTwoHands = (handA, handB, resultA, resultB) => {
    // Step 1: 比較牌型 (rank)
    if (resultA.rank !== resultB.rank) {
      return resultA.rank - resultB.rank; // rank 值越大牌型越強
    }

    // Step 2: 若牌型相同，按牌值大小比較
    const valuesA = handA.map((card) => cardValue(card)).sort((a, b) => b - a); // 由大到小排序
    const valuesB = handB.map((card) => cardValue(card)).sort((a, b) => b - a);

    for (let i = 0; i < Math.min(valuesA.length, valuesB.length); i++) {
      if (valuesA[i] !== valuesB[i]) {
        return valuesA[i] - valuesB[i]; // 數值大的牌型更強
      }
    }

    return 0;
  };

  // 比較前牌與中牌
  const frontVsMiddle = compareTwoHands(
    front,
    middle,
    frontResult,
    middleResult
  );
  if (frontVsMiddle >= 0) {
    return false; // 若前牌 >= 中牌，返回 false（不符合規則）
  }

  // 比較中牌與後牌
  const middleVsBack = compareTwoHands(middle, back, middleResult, backResult);
  if (middleVsBack >= 0) {
    return false; // 若中牌 >= 後牌，返回 false（不符合規則）
  }

  // 符合規則
  return true;
};
