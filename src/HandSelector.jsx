import PropTypes from "prop-types";
import { Source_Poker, suits } from "./utils/utils";

const HandSelector = ({ hand, setHand, maxLength, label }) => {
  const handleAddCard = (index, value) => {
    if (!value) return;

    const card = JSON.parse(value);
    const allCards = hand.slice();
    allCards[index] = card; // 替換或新增選擇的撲克牌
    setHand(allCards);
  };

  return (
    <div className="mb-3">
      <h3>{label}</h3>
      {Array.from({ length: maxLength }).map((_, index) => (
        <select
          key={index}
          className="form-select mb-2"
          value={JSON.stringify(hand[index] || "")}
          onChange={(e) => handleAddCard(index, e.target.value)}
        >
          <option value="">選擇一張撲克牌</option>
          {Source_Poker.map((card, idx) => (
            <option key={idx} value={JSON.stringify(card)}>
              {suits[card[0]]}
              {card[1]}
            </option>
          ))}
        </select>
      ))}
      <p>
        已選擇的撲克牌：
        {hand.map((card) => `${suits[card[0]]}${card[1]}`).join(", ")}
      </p>
    </div>
  );
};

HandSelector.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.array).isRequired,
  setHand: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default HandSelector;
