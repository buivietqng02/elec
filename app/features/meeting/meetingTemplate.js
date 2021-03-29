define(() => {
    const template = {
        notConnectDevice: `
            <div id="not-connect-device" class="error-device-meeting">
                <div class="edm-wrapper">
                    <div class="edmw-wrapper">
                        <h2>Device not found</h2>
                        <p>No device found matching the requirements.</p>
                        <button class="btn btn-primary" onclick="location.reload();">Reload the page</button>
                    </div>
                </div>
            </div>
        `,
        notAllowDevice: `
            <div id="not-allow-device" class="error-device-meeting">
                <div class="edm-wrapper">
                    <div class="edmw-wrapper">
                        <h2>Access is not allowed</h2>
                        <p>You did not allow browser access to the device. You have denied access in the current session or globally.</p>
                        <button class="btn btn-primary" onclick="location.reload();">Reload the page</button>
                    </div>
                </div>
            </div>
        `
    };

    return Object.freeze(template);
});
