import { update_role_info } from "../server/socket";
import { useEffect, useState } from "react";
import IncreaseDecrease from "./ability_components/in_de_component";
import IncreaseFuel from "./ability_components/increase_fuel";
import DecreaseLifeSupport from "./ability_components/decrease_life_support";
import BlockPOI from "./ability_components/block_poi";
import CloseChat from "./ability_components/close_chat";

export default function RoleInfo() {
    const [roleName, setRoleName] = useState("");
    const [abilityInfo, setAbilityInfo] = useState("");
    const [ability, setAbility] = useState("");
    const [teamName, setTeamName] = useState("");

    useEffect(() => {
        const old_info = update_role_info(on_role_update);
        if (old_info) {
            on_role_update(old_info);
        }
    });

    function on_role_update(role) {
        setRoleName(role.name);
        setAbilityInfo(role.ability_text);
        setTeamName(role.group_name);
        setAbility(role.ability)
    }

    const renderAbility = (abilityInfo) => {
        switch (abilityInfo) {
            case 'doctor':
            case 'engineer':
            case 'rebel':
            case 'alien':
            case 'robot':
            case 'parasite':
            case 'scanevenger':
                return <IncreaseDecrease/>
            default:
                return <></>;
        }
      };

    return (
        <div className="bg-slate-900 text-xl text-white text-center m-1 py-2 px-10 rounded-xl">
            <b className="text-3xl text-red-300">
                <strong>
                    Role
                </strong>
            </b>
            <p className="mb-5">
                <b className="text-slate-200">
                    Name
                </b>
                <br/>
                {roleName}
                <br className="leading-10"/>
                <b className="text-slate-200">
                    Team
                </b>
                <br/>
                {teamName}
                <br className="leading-10"/>
                <b className="text-slate-200">
                    Ability
                </b>
                <br/>
                {abilityInfo}
            </p>
            {renderAbility(ability)}
        </div>
    );
}