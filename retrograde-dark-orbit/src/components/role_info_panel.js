import { update_role_info } from "../server/socket";
import { useEffect, useState } from "react";

export default function RoleInfo() {
    const [roleName, setRoleName] = useState("");

    useEffect(() => {
        const old_info = update_role_info(on_role_update);
        if (old_info) {
            setRoleName(old_info.name);
        }
    });

    function on_role_update(role) {
        setRoleName(role.name);
    }

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
            </p>
        </div>
    );
}