import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/context/AuthContext";
import styles from "./MangeUsers.module.css";
import { useForm } from "react-hook-form";
const MangeUsers = () => {
  const { getUsers, deleteUser, updateUser, getUserRoles } =
    useContext(AuthContext);
  const [users, setUsers] = useState();
  const [mode, setMode] = useState("users");
  const [roles, setRoles] = useState("");
  const [userId, setUserId] = useState();
  const handleRoles = useCallback(
    (id) => {
      getUserRoles(id).then((res) => {
        console.log(res.data);
        setRoles(res.data);
        setUserId(id);
      });
    },
    [getUserRoles]
  );
  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data.users);
        console.log(res.data.users);
      })
      .catch((err) => console.log(err.message));
  }, [getUsers]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSumbit = async (data) => {
    if (data.role == "user") {
      data.role = "";
    }
    updateUser(userId, data.username, data.role);
    setMode("users");
  };

  const validateUserName = (username) => {
    const re = /^[a-zA-Z]/;
    return re.test(username);
  };

  return (
    <section className="container">
      {mode == "users" ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          {users ? (
            <tbody>
              {users.map((user, id) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {!user.permissions.includes("Edit User") &&
                  !user.permissions.includes("Delete User") ? (
                    <td className={styles.manage}>
                      <small
                        className={styles.edit}
                        onClick={() => {
                          setMode("edit");
                          handleRoles(user.id);
                        }}
                      >
                        edit
                      </small>
                      <small
                        className={styles.delete}
                        onClick={() => {
                          deleteUser(user.id);
                          setUsers(users.filter((u) => u.id !== user.id));
                        }}
                      >
                        delete
                      </small>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      ) : (
        <form
          className={Object.keys(errors).length > 0 ? "error form" : "form"}
          onSubmit={handleSubmit(onSumbit)}
        >
          <h2>Edit User Roles</h2>
          <div className="input__group">
            <label htmlFor="name">New Name : </label>
            <input
              type="text"
              id="name"
              {...register("username", {
                required: true,
                validate: validateUserName,
              })}
              className={errors.username ? "error" : null}
            />
            {errors.username?.type == "required" ? (
              <small className="error__message">
                New name cannot be empty.
              </small>
            ) : null}
            {errors.username?.type == "validate" ? (
              <small className="error__message">
                New name should started with letter.
              </small>
            ) : null}
          </div>
          <div className="input__group">
            <div>
              <label htmlFor="new_roles">Current Role : </label>
              {roles && roles.userRole[0] ? (
                <small className="success" style={{ fontSize: "1rem" }}>
                  {roles.userRole[0]}
                </small>
              ) : (
                <small className="failure" style={{ fontSize: "1rem" }}>
                  user
                </small>
              )}
            </div>
            <div>
              <label htmlFor="new_roles">New Roles : </label>
              <select
                id="new_roles"
                {...register("role", {
                  required: true,
                })}
                className={errors.role ? "error" : null}
                style={errors.role ? { borderColor: "#f0160b" } : null}
              >
                <option disabled="disabled">--select role--</option>
                <option value="user"> user</option>
                <option value="admin">admin</option>
                <option value="super admin"> super admin</option>
              </select>
            </div>
            {errors.role?.type == "required" ? (
              <small className="error__message">You must select role.</small>
            ) : null}
          </div>
          <div className="input__group"></div>
          <button
            className="keep"
            style={{ marginLeft: "auto", marginRight: "auto" }}
            onClick={() => {
              setMode("users");
            }}
          >
            Go Back
          </button>
          <button className="submit" type="submit">
            Update
          </button>
        </form>
      )}
    </section>
  );
};

export default MangeUsers;