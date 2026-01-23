// logger.js - A Clean & Stylish Logger Middleware

import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Colors (ANSI escape codes)
    const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',

        // Text colors
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',

        // Background colors
        bgGreen: '\x1b[42m',
        bgYellow: '\x1b[43m',
        bgRed: '\x1b[41m',
        bgBlue: '\x1b[44m',
        bgMagenta: '\x1b[45m',
        bgCyan: '\x1b[46m',
    };

    // Method colors
    const getMethodColor = (method: any) => {
        const methodColors = {
            GET: colors.green,
            POST: colors.blue,
            PUT: colors.yellow,
            PATCH: colors.magenta,
            DELETE: colors.red,
            OPTIONS: colors.cyan,
        };
        return methodColors[method] || colors.white;
    };

    // Status code colors & emoji
    const getStatusStyle = (code: any) => {
        if (code >= 500) return { color: colors.red, emoji: '💥', label: 'ERROR' };
        if (code >= 400) return { color: colors.yellow, emoji: '⚠️ ', label: 'WARN' };
        if (code >= 300) return { color: colors.cyan, emoji: '↪️ ', label: 'REDIRECT' };
        if (code >= 200) return { color: colors.green, emoji: '✅', label: 'OK' };
        return { color: colors.white, emoji: '❓', label: 'INFO' };
    };

    // Format timestamp
    const getTimestamp = () => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const time = now.toLocaleTimeString('en-GB', { hour12: false });
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${date} ${time}.${ms}`;
    };

    // When response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method;
        const url = req.originalUrl || req.url;
        const timestamp = getTimestamp();

        const methodColor = getMethodColor(method);
        const statusStyle = getStatusStyle(status);

        // Build the log line
        const line = [
            '',
            `${colors.dim}┌──────────────────────────────────────────────────────────────┐${colors.reset}`,
            `${colors.dim}│${colors.reset} ${statusStyle.emoji} ${colors.bright}${timestamp}${colors.reset}`,
            `${colors.dim}│${colors.reset}`,
            `${colors.dim}│${colors.reset}   ${colors.bright}Method:${colors.reset}   ${methodColor}${colors.bright}${method.padEnd(7)}${colors.reset}`,
            `${colors.dim}│${colors.reset}   ${colors.bright}Route:${colors.reset}    ${colors.cyan}${url}${colors.reset}`,
            `${colors.dim}│${colors.reset}   ${colors.bright}Status:${colors.reset}   ${statusStyle.color}${status} ${statusStyle.label}${colors.reset}`,
            `${colors.dim}│${colors.reset}   ${colors.bright}Time:${colors.reset}     ${getDurationColor(duration)}${duration}ms${colors.reset}`,
            `${colors.dim}│${colors.reset}   ${colors.bright}IP:${colors.reset}       ${colors.dim}${req.ip || req.connection.remoteAddress}${colors.reset}`,
            `${colors.dim}└──────────────────────────────────────────────────────────────┘${colors.reset}`,
            '',
        ].join('\n');

        console.log(line);
    });

    // Duration color based on response time
    function getDurationColor(ms: number) {
        if (ms < 100) return colors.green;
        if (ms < 500) return colors.yellow;
        return colors.red;
    }

    next();
};

// Startup banner
const showBanner = (port: number) => {
    const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        cyan: '\x1b[36m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        magenta: '\x1b[35m',
        dim: '\x1b[2m',
    };

    const banner = `
${colors.cyan}${colors.bright}
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║     ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗      ║
    ║     ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗     ║
    ║     ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝     ║
    ║     ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗     ║
    ║     ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║     ║
    ║     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝     ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
${colors.reset}
    ${colors.green}●${colors.reset} ${colors.bright}Status:${colors.reset}     ${colors.green}Running${colors.reset}
    ${colors.yellow}◐${colors.reset} ${colors.bright}Port:${colors.reset}       ${colors.yellow}${port}${colors.reset}
    ${colors.magenta}◆${colors.reset} ${colors.bright}Mode:${colors.reset}       ${colors.magenta}${process.env.NODE_ENV || 'development'}${colors.reset}
    ${colors.cyan}◈${colors.reset} ${colors.bright}Time:${colors.reset}       ${colors.cyan}${new Date().toLocaleString()}${colors.reset}
    
    ${colors.dim}──────────────────────────────────────────────────────${colors.reset}
    ${colors.dim}Ready to accept connections...${colors.reset}
    ${colors.dim}Press CTRL+C to stop${colors.reset}
    `;

    console.log(banner);
};

export { logger, showBanner };
