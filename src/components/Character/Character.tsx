import { useState } from 'react';
import './Character.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../../consts';
import { Attributes, Class, DndCharacterData, Skill } from '../../types';

function Character({ data, onUpdate }: CharacterProps) {
    const { id, attributes, skills } = data;

    const [currentClass, setCurrentClass] = useState<Class | null>(null)

    function changeAttributeLevel(attribute: keyof Attributes, delta: number) {
        const updatedAttributes = { ...attributes, [attribute]: attributes[attribute] + delta }
        onUpdate({ id, attributes: updatedAttributes, skills })
    }

    function meetsClassRequirements(className: Class): boolean {
        return Object.entries(CLASS_LIST[className]).every(([key, val]) => attributes[key as keyof Attributes] >= val)
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
    const totalPointsAvailable = 10 + (4 * calculateModifier(attributes.Intelligence))
    const totalPointsSpent = Object.values(skills).reduce((sum, points) => sum + points, 0)
    const pointsRemaining = totalPointsAvailable - totalPointsSpent

    function changeSkillLevel(skillName: keyof Skill, delta: number) {
        const newValue = skills[skillName] + delta
        const totalSpent = Object.values(skills).reduce((sum, points) => sum + points, 0)

        if (newValue >= 0 && totalSpent + delta <= totalPointsAvailable) {
            const updatedSkills = { ...skills, [skillName]: newValue }
            onUpdate({ id, attributes, skills: updatedSkills })
        }
    }

    return (
        <div className="character">
            <h3>Attributes</h3>
            <div className="character-attributes">
                {
                    ATTRIBUTE_LIST.map((attr, idx) => {
                        const modifier = calculateModifier(attributes[attr])
                        const modifierStr = modifier > 0 ? `+${modifier}` : `${modifier}`
                        return (
                            <div className="character-attribute-row" key={idx}>
                                <span className="character-attribute-name">{attr}:</span>
                                <span className="character-attribute-value">{ attributes[attr] }</span>
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
                    const attributeModifier = attributes[skill.attributeModifier as keyof Attributes]
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

interface CharacterProps {
    data: DndCharacterData,
    onUpdate: (updatedCharacter: DndCharacterData) => void;
}

export default Character
