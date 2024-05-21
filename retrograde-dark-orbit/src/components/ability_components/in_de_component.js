import { update_role_info, use_ability } from "./../../server/socket";
import { getItem, storeItem } from "./../../server/storage";
import { use, useEffect, useState } from "react";

export default function IncreaseDecrease() {
    const [used, setUsed] = useState(false);

    useEffect(() => {
        const role_info = update_role_info(on_role_update);
        if (role_info) {
            on_role_update(role_info);
        }
    }, []);

    function on_role_update(role) {
        if (role.used) {
            setUsed(role.used);
        }
    }

    function click() {
        use_ability({});
        setUsed(true);
        let info = getItem("RoleInfo");
        if (!info) {
            info = {used: true}
        }
        info.used = true;
        storeItem("RoleInfo", info);
    }

    return (
        <button className="bg-slate-700 rounded-xl py-2 px-5 m-2 hover:bg-slate-600 disabled:bg-slate-950 disabled:text-gray-700"
            disabled={used} onClick={click}>
            {used ? "Activated" : "Activate"}
        </button>
    );

}