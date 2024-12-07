const fs = require('fs');
const https = require('https');

const PROXY_URLS = [
    "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text",
    "https://raw.githubusercontent.com/dpangestuw/Free-Proxy/refs/heads/main/All_proxies.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/refs/heads/main/proxies/all.txt"
];

const PROXY_FILE = process.argv[2] || "proxy.txt";

function logMessage(type, message) {
    const datetime = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
    const brightColors = {
        INFO: "\x1b[1;92m",
        ERROR: "\x1b[1;91m",
        DEFAULT: "\x1b[1;97m"
    };
    const color = brightColors[type] || brightColors.DEFAULT;
    console.log(`\x1b[1;97m[${datetime}] \x1b[1;95m| ${color}[${type}] \x1b[1;95m| \x1b[1;94m${message}\x1b[0m`);
}

async function fetchProxies(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const count = data.split('\n').filter(line => line.trim() !== '').length;
                    logMessage("INFO", `Fetched ${count} proxies from ${url}.`);
                    resolve(data);
                } else {
                    logMessage("ERROR", `Failed to fetch proxies from ${url}. Status code: ${res.statusCode}`);
                    resolve('');
                }
            });
        }).on('error', err => {
            logMessage("ERROR", `Error fetching proxies from ${url}: ${err.message}`);
            reject(err);
        });
    });
}

async function processProxies() {
    logMessage("INFO", "Starting to fetch proxies...");
    fs.writeFileSync(PROXY_FILE, '');
    for (const url of PROXY_URLS) {
        try {
            const proxies = await fetchProxies(url);
            if (proxies) {
                fs.appendFileSync(PROXY_FILE, proxies + '\n');
            }
        } catch (err) {
            logMessage("ERROR", `An error occurred: ${err.message}`);
        }
    }
    const totalCount = fs.readFileSync(PROXY_FILE, 'utf-8').split('\n').filter(line => line.trim() !== '').length;
    logMessage("INFO", `Total proxies saved to ${PROXY_FILE}: ${totalCount}.`);
}

processProxies();
