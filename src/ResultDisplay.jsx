import PropTypes from "prop-types";

const ResultDisplay = ({ results }) => {
  // 比較兩副手牌，返回勝、負或平手
  const compareTwoHands = (handA, typeA, handB, typeB) => {
    if (typeA.rank !== typeB.rank) {
      return typeA.rank - typeB.rank;
    }

    const valuesA = handA.map((card) => card[1]).sort((a, b) => b - a);
    const valuesB = handB.map((card) => card[1]).sort((a, b) => b - a);

    for (let i = 0; i < Math.min(valuesA.length, valuesB.length); i++) {
      if (valuesA[i] !== valuesB[i]) {
        return valuesA[i] - valuesB[i];
      }
    }

    return 0; // 平手
  };

  // 計算堵數
  const calculateBlocks = (playerResults) => {
    const numPlayers = playerResults.length;
    const blocks = Array(numPlayers).fill(0);

    for (let i = 0; i < numPlayers; i++) {
      for (let j = 0; j < numPlayers; j++) {
        if (i === j) continue; // 不與自己比較

        let player1Wins = 0;
        let player2Wins = 0;
        let draws = 0;

        // 比較三墩牌
        for (let k = 0; k < 3; k++) {
          const comparison = compareTwoHands(
            playerResults[i].hands[k].hand,
            playerResults[i].hands[k].type,
            playerResults[j].hands[k].hand,
            playerResults[j].hands[k].type
          );

          if (comparison > 0) {
            player1Wins++;
          } else if (comparison < 0) {
            player2Wins++;
          } else {
            draws++;
          }
        }

        // 判斷堵數
        if (player1Wins === 3) {
          blocks[i] += 6; // 打槍
          blocks[j] -= 6;
        } else if (player2Wins === 3) {
          blocks[i] -= 6; // 被打槍
          blocks[j] += 6;
        } else if (player1Wins > player2Wins) {
          blocks[i] += 1; // 贏 1 堵
          blocks[j] -= 1;
        } else if (player2Wins > player1Wins) {
          blocks[i] -= 1; // 輸 1 堵
          blocks[j] += 1;
        }

        // 輾過判斷
        if (
          (player1Wins === 2 && draws === 1) ||
          (player1Wins === 1 && draws === 2)
        ) {
          blocks[i] += 6; // 輾過
          blocks[j] -= 6;
        }
      }
    }

    // 加堵判斷
    playerResults.forEach((result, idx) => {
      result.hands.forEach((handResult, handIdx) => {
        const type = handResult.type.type;

        if (handIdx === 0 && type === "三條") {
          blocks[idx] += 3; // 衝三
        } else if (handIdx === 1 && type === "四條") {
          blocks[idx] += 8; // 中墩鐵枝
        } else if (handIdx === 2 && type === "四條") {
          blocks[idx] += 4; // 後墩鐵枝
        } else if (handIdx === 1 && type === "同花順") {
          blocks[idx] += 10; // 中墩同花順
        } else if (handIdx === 2 && type === "同花順") {
          blocks[idx] += 5; // 後墩同花順
        }
      });
    });

    return blocks;
  };

  // 顯示牌型與最大數字
  const renderHandWithType = (handResult) => {
    const type = handResult.type.type;
    const maxWeight = handResult.hand
      .map((card) => card[1])
      .sort((a, b) => b - a)[0];
    return `${type} ${maxWeight}`;
  };

  // 渲染表格行
  const renderRow = (result, idx, blocks) => (
    <tr key={result.id}>
      <td>{result.id}</td>
      {result.hands.map((handResult, i) => (
        <td key={i}>{renderHandWithType(handResult)}</td>
      ))}
      <td>{blocks[idx]}</td> {/* 僅顯示正負堵數 */}
    </tr>
  );

  // 主表格渲染邏輯
  const renderResults = (results) => {
    const blocks = calculateBlocks(results);
    return <>{results.map((result, idx) => renderRow(result, idx, blocks))}</>;
  };

  return (
    <div>
      <h2>結果記錄</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">編號</th>
            <th scope="col">前牌</th>
            <th scope="col">中牌</th>
            <th scope="col">後牌</th>
            <th scope="col">堵數</th>
          </tr>
        </thead>
        <tbody>{renderResults(results)}</tbody>
      </table>
    </div>
  );
};

ResultDisplay.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      hands: PropTypes.arrayOf(
        PropTypes.shape({
          hand: PropTypes.array.isRequired,
          type: PropTypes.shape({
            type: PropTypes.string.isRequired,
            rank: PropTypes.number.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default ResultDisplay;
