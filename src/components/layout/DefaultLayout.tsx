// @ts-ignore
import { withRouter } from "react-router-dom";

const DefaultLayout = ( children:any) => {
  return <div>{children}</div>;
};

export default withRouter(DefaultLayout);
