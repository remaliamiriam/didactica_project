//folosi tin profile home pentru testare
import React from "react";
import { useUser } from "../hooks/UserContext";

const TestComponent = () => {
  const { user, login, logout } = useUser();

  return (
    <div className="p-3 bg-dark text-light rounded">
      <h5>Test UserContext</h5>
      {user ? (
        <>
          <p><strong>Nickname:</strong> {user.nickname}</p>
          <button className="btn btn-warning" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>Nu ești logat.</p>
          <button
            className="btn btn-success"
            onClick={() => login({ id: "123", nickname: "TestUser" })}
          >
            Login ca TestUser
          </button>
        </>
      )}
    </div>
  );
};

export default TestComponent;
