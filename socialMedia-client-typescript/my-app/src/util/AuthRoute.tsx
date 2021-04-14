import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const AuthRoute = ({ component: Component, authenticated, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);
const mapStateToProps = (state: any) => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps)(AuthRoute);
