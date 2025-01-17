import { useState } from 'react';
import './Character.css'
import { ATTRIBUTE_LIST } from '../../consts';

function Character() {
    const [attributeLevel, setAttributeLevel] = useState(
        ATTRIBUTE_LIST.reduce((acc, curr) => {
            acc[curr] = 10
            return acc
        }, {})
    )

    function handleChange(attribute, delta) {
        setAttributeLevel((prev) => {
            return {
                ...prev,
                [attribute]: prev[attribute] + delta
            }
        })
    }

    return (
        <div className="character">
            <div className="character-attributes">
                {
                    ATTRIBUTE_LIST.map((attr, idx) => (
                        <div className="character-attribute-row" key={idx}>
                            <span>{attr}: { attributeLevel[attr] }</span>
                            <button onClick={() => handleChange(attr, -1)}>-</button>
                            <button onClick={() => handleChange(attr, 1)}>+</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )

}

export default Character