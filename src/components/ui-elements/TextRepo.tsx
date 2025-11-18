import ProtoTypes from 'prop-types';
import '../ui-elements/element-ui.scss';

// ========== for heading text ==========
export const AuthTitle = (props:any) => {
    const { children, className } = props;
    return (<> <h1 {...props} className={`auth-text  ${className}`}>{children}</h1></>)
}
AuthTitle.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string,
    style:ProtoTypes.any
}

// ========== for heading text ==========
export const MainTitle = (props:any) => {
    const { children, className } = props;
    return (<> <h1 {...props} className={`title-css mb-2 ${className}`}>{children}</h1></>)
}
MainTitle.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string
}


// ========== for Regular text ==========
export const NormalText = (props:any) => {
    const { children, className } = props;
    return (
        <><p {...props} className={`normal-text ${className} text-break`}>{children}</p></>
    )
}
NormalText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string
}

// ========== for Regular Bold text ==========
export const NormalBoldText = (props:any) => {
    const { children, className } = props;
    return (
        <><p {...props} className={`normal-bold-text ${className} text-break`}>{children}</p></>
    )
}
NormalBoldText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string
}

// ========== for small text ==========
export const SmallText = (props:any) => {
    const { children, className } = props;
    return (
        <><p {...props} className={`small-text ${className}`}>{children}</p></>
    )
}
SmallText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string,
    style:ProtoTypes.any
}

// ========== for small regular text ==========
export const InfoText = (props:any) => {
    const { children, className } = props;
    return (
        <><p {...props} className={`info-text ${className}`}>{children}</p></>
    )
}
InfoText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string,
    style:ProtoTypes.any
}

// ========== for Bold text ==========
export const BoldText = (props:any) => {
    const { children, className } = props;
    return (
        <><p {...props} className={`bold-text ${className}`}>{children}</p></>
    )
}
BoldText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string,
    style:ProtoTypes.any
}

// ========== for Bold text ==========
export const CardHeadText = (props:any) => {
    const { children, className } = props;
    return (
        <><h4 {...props} className={`card-head-text ${className}`}>{children}</h4></>
    )
}

CardHeadText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string
}

// ============           =================
export const CardCurrencyText = (props:any) => {
    const { children, className } = props;
    return (
        <><h5 {...props} className={`card-currency-text ${className}`}>{children}</h5></>
    )
}
CardCurrencyText.propTypes = {
    children: ProtoTypes.node,
    className: ProtoTypes.string
}