import { Button } from 'antd';
import PropTypes from "prop-types";
import '../ui-elements/element-ui.scss';

// regular rounded button
export const MainButtonRound = (props:any) => {
    const { children, className } = props;
    return (
        <>
            <Button {...props} className={`trust-button-round mt-0 ${className}`} >{children}</Button>
        </>
    )
};
MainButtonRound.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
    htmlType:PropTypes.string,
    loading:PropTypes.bool,
    disabled:PropTypes.any
}

export const LinkButton = (props:any) => {
    const { children, className } = props;
    return (
        <>
            <Button {...props} type="link" className={`px-0 link ${className}`} >{children}</Button>
        </>
    )
};
LinkButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
    onclick: PropTypes.func
}

export const ViewButton = (props:any) => {
    const { children, className } = props;
    return (
        <>
            <Button {...props} type="link" className={`link-view px-0  ${className}`} >{children}</Button>
        </>
    )
};
ViewButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
    onclick: PropTypes.func,
    disabled:PropTypes.any,
    onClick:PropTypes.any,
    loading:PropTypes.any

}

export const SecondaryOutLineButton = (props:any) => {
    const { children, className } = props;
    return (
        <>
            <Button {...props} className={`trust-button-outline ${className}`} style={{height:'auto'}}><b>{children}</b></Button>
        </>
    )
};
SecondaryOutLineButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOver:PropTypes.func,
    onMouseLeave:PropTypes.func,
    htmlType:PropTypes.any,
    loading:PropTypes.any,
    disabled:PropTypes.any
}

export const PrimaryOutLineButton = (props:any) => {
    const { children, className } = props;
    return (
        <>
            <Button {...props} className={`trust-button-primary-outline ${className}`} ><b>{children}</b></Button>
        </>
    )
};
PrimaryOutLineButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
    disabled:PropTypes.any
}