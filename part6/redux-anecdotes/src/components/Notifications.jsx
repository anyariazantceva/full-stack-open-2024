import { useSelector } from "react-redux";

const Notifications = () => {
  const notification = useSelector((state) => state.notifications);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  return <div style={style}>{notification}</div>;
};

export default Notifications;
