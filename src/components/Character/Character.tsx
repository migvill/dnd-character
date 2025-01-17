import { useState } from 'react';
import './Character.css'
import { ATTRIBUTE_LIST, CLASS_LIST } from '../../consts';
import { Attributes, Class } from '../../types';

function Character() {
    const [attributeLevel, setAttributeLevel] = useState<Attributes>(
        ATTRIBUTE_LIST.reduce((acc, curr) => {
            acc[curr] = 10
            return acc
        }, {} as Attributes)
    )
    const [currentClass, setCurrentClass] = useState<Class | null>(null)

    function changeAttributeLevel(attribute: keyof Attributes, delta: number) {
        setAttributeLevel((prev) => {
            return {
                ...prev,
                [attribute]: prev[attribute] + delta
            }
        })
    }

    return (
        <div className="character">
            <h3>Attributes</h3>
            <div className="character-attributes">
                {
                    ATTRIBUTE_LIST.map((attr, idx) => (
                        <div className="character-attribute-row" key={idx}>
                            <span>{attr}: { attributeLevel[attr] }</span>
                            <button onClick={() => changeAttributeLevel(attr as keyof Attributes, -1)}>-</button>
                            <button onClick={() => changeAttributeLevel(attr as keyof Attributes, 1)}>+</button>
                        </div>
                    ))
                }
            </div>
            <h3>Classes</h3>
            <div className="character-classes">
                {
                    Object.keys(CLASS_LIST).map((className) => (
                        <div className="character-class" key={className} onClick={() => setCurrentClass(className as Class)}>
                            {className}
                        </div>
                    ))
                }
            </div>

            {currentClass && (
                <div className="character-class-requirements">
                    <h3>{currentClass} Requirements</h3>
                    <ul>
                        {Object.entries(CLASS_LIST[currentClass]).map(([attribute, level]) => (
                            <li key={attribute}>{attribute}: {level}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )

}

export default Character