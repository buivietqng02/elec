define(() => {
    // const XM_URL = 'xm.iptp.net';
    const XM_URL = process.env.NODE_ENV === 'production' ? 'xm.iptp.net' : 'xm.iptp.dev';
    const BASE_URL = `https://${XM_URL}/xm`;

    return BASE_URL;
});
