import { useState } from 'react';
import './Character.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../../consts';
import { Attributes, Class, Skill } from '../../types';

function Character() {
    const [attributeLevel, setAttributeLevel] = useState<Attributes>(
        ATTRIBUTE_LIST.reduce((acc, curr) => {
            acc[curr] = 10
            return acc
        }, {} as Attributes)
    )
    const [currentClass, setCurrentClass] = useState<Class | null>(null)

    const [skills, setSkills] = useState<Skill>(
        SKILL_LIST.reduce((acc, { name }) => {
            acc[name] = 0
            return acc
        }, {} as Skill)
    )

    function changeAttributeLevel(attribute: keyof Attributes, delta: number) {
        setAttributeLevel((prev) => {
            return {
                ...prev,
                [attribute]: prev[attribute] + delta
            }
        })
    }

    function meetsClassRequirements(className: Class): boolean {
        return Object.entries(CLASS_LIST[className]).every(([key, val]) => attributeLevel[key as keyof Attributes] >= val)
    }

    function selectClass(className: Class) {
        setCurrentClass(currentClass === className ? null : className)
    }

    function calculateModifier(attributeValue: number): number {
        // +1 for each 2 points above 10
        const base = attributeValue - 10
        return Math.floor(base / 2)
    }
    
    // Characters have 10 + (4 * Intelligence Modifier) points to spend between skills
    const totalPointsAvailable = 10 + (4 * calculateModifier(attributeLevel.Intelligence))
    const totalPointsSpent = Object.values(skills).reduce((sum, points) => sum + points, 0)
    const pointsRemaining = totalPointsAvailable - totalPointsSpent

    function changeSkillLevel(skillName: keyof Skill, delta: number) {
        setSkills((prev) => {
            const newValue = prev[skillName] + delta
            const totalSpent = Object.values(prev).reduce((sum, points) => sum + points, 0)

            if (newValue >= 0 && totalSpent + delta <= totalPointsAvailable) {
                return { ...prev, [skillName]: newValue }
            }
            return prev
        })
    }

    return (
        <div className="character">
            <h3>Attributes</h3>
            <div className="character-attributes">
                {
                    ATTRIBUTE_LIST.map((attr, idx) => {
                        const modifier = calculateModifier(attributeLevel[attr])
                        const modifierStr = modifier > 0 ? `+${modifier}` : `${modifier}`
                        return (
                            <div className="character-attribute-row" key={idx}>
                                <span className="character-attribute-name">{attr}:</span>
                                <span className="character-attribute-value">{ attributeLevel[attr] }</span>
                                <span className="character-attribute-modifier">(Modifier: {modifierStr})</span>
                                <button onClick={() => changeAttributeLevel(attr as keyof Attributes, -1)}>-</button>
                                <button onClick={() => changeAttributeLevel(attr as keyof Attributes, 1)}>+</button>
                            </div>
                        )
                    })
                }
            </div>
            <h3>Classes</h3>
            <div className="character-classes">
                {
                    Object.keys(CLASS_LIST).map((className) => {
                        const meetsRequirement = meetsClassRequirements(className as Class)
                        return (
                            <div
                                className={`character-class ${meetsRequirement ? 'meets' : ''}`}
                                key={className}
                                onClick={() => selectClass(className as Class)}>
                                {className}
                            </div>
                        )
                    })
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

            <h3>Skills</h3>
            <div className="character-skills">
                <h4>Total points: {totalPointsAvailable} (Available) | {pointsRemaining} (Remaining)</h4>
                {SKILL_LIST.map((skill) => {
                    const attributeModifier = attributeLevel[skill.attributeModifier as keyof Attributes]
                    const skillTotalValue = skills[skill.name] + Math.floor((attributeModifier - 10) / 2)
                    return (
                        <div className="character-skill-row" key={skill.name}>
                            <span className="character-skill-name">{skill.name}:</span>
                            <span className="character-skill-points">Points: {skills[skill.name]}</span>
                            <span className="character-skill-modifier">({skill.attributeModifier} Modifier: {Math.floor((attributeModifier - 10) / 2)})</span>
                            <span className="character-skill-total">Total: {skillTotalValue}</span>
                            <button onClick={() => changeSkillLevel(skill.name, -1)}>-</button>
                            <button onClick={() => changeSkillLevel(skill.name, 1)}>+</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Character
