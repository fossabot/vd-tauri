import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// project import
import Highlighter from './third-party/Highlighter';

// header style
const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //

// eslint-disable-next-line react/display-name
const MainCard = forwardRef(
    (
        {
            borderCustom,
            hoverActive,
            border = true,
            boxShadow,
            children,
            subheader,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            secondary,
            shadow,
            sx = {},
            title,
            codeHighlight = false,
            codeString,
            modal = false,
            ...others
        },
        ref
    ) => {
        const theme = useTheme();
        boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

        return (
            <Card
                elevation={elevation || 0}
                ref={ref}
                {...others}
                sx={{
                    position: 'relative',
                    border: border ? '1px solid' : 'none',
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    borderColor: !borderCustom
                        ? theme.palette.mode === 'dark'
                            ? theme.palette.divider
                            : theme.palette.grey.A800
                        : contentSX.borderColor,
                    boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',
                    ':hover': {
                        boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit',
                        opacity: hoverActive ? 0.8 : 1
                    },
                    ...(codeHighlight && {
                        '& pre': {
                            m: 0,
                            p: '12px !important',
                            fontFamily: theme.typography.fontFamily,
                            fontSize: '0.75rem'
                        }
                    }),
                    ...(modal && {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
                        '& .MuiCardContent-root': {
                            overflowY: 'auto',
                            minHeight: 'auto',
                            maxHeight: `calc(100vh - 200px)`
                        }
                    }),
                    ...sx
                }}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader
                        sx={headerSX}
                        titleTypographyProps={{ variant: 'subtitle1' }}
                        title={title}
                        action={secondary}
                        subheader={subheader}
                    />
                )}
                {darkTitle && title && (
                    <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />
                )}

                {/* content & header divider */}
                {title && divider && <Divider />}

                {/* card content */}
                {content && <CardContent sx={contentSX}>{children}</CardContent>}
                {!content && children}

                {/* card footer - clipboard & highlighter  */}
                {codeString && (
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <Highlighter codeString={codeString} codeHighlight={codeHighlight} />
                    </>
                )}
            </Card>
        );
    }
);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    subheader: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    divider: PropTypes.bool,
    borderCustom: PropTypes.bool,
    hoverActive: PropTypes.bool,
    elevation: PropTypes.number,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    modal: PropTypes.bool,
    codeHighlight: PropTypes.bool,
    codeString: PropTypes.string
};

export default MainCard;
