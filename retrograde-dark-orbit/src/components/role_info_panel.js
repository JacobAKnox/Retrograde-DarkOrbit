export default function RoleInfo() {
    const role_name = "Dummy Name";
    const available_points = 5;
    const total_points = 10;
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
                {role_name}
            </p>
            <p className="mb-5">
                <b className="text-slate-200">
                    Points
                </b>
                <br/>
                {available_points}
                /
                {total_points}
            </p>
        </div>
    );
}