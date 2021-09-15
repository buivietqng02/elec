define(() => {
    const obj = {
        VIETNAMESE: '<svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect style="fill:#C8172B" height="298.7" width="512" y="106.7"/><polygon style="fill:#FCFF2C" points="292.2,277.2 314.5,346 256,303.5 197.5,346 219.8,277.2 161.3,234.7 233.6,234.7 256,165.9    278.4,234.7 350.7,234.7  "/></g></svg>',
        ENGLISH: '<svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect style="fill:#FFFFFF" height="298.7" width="512" y="106.7"/><polygon style="fill:#BD0034" points="342.8,214.7 512,119.9 512,106.7 500.3,106.7 307.4,214.7  "/><polygon style="fill:#BD0034" points="334.8,303.4 512,402.5 512,382.7 370.2,303.4  "/><polygon style="fill:#BD0034" points="0,129.4 151.5,214.7 187,214.7 0,109.5  "/><polygon style="fill:#BD0034" points="178.9,303.4 0,403.6 0,405.4 32.3,405.4 214.4,303.4  "/><polygon style="fill:#1A237B" points="477,106.7 297.7,106.7 297.7,207.1  "/><polygon style="fill:#1A237B" points="218.5,106.7 40,106.7 218.5,207.1  "/><polygon style="fill:#1A237B" points="512,214.7 512,146.1 390.4,214.7  "/><polygon style="fill:#1A237B" points="512,371.1 512,303.4 390.4,303.4  "/><polygon style="fill:#1A237B" points="50.1,405.4 218.5,405.4 218.5,310.9  "/><polygon style="fill:#1A237B" points="297.7,405.4 466.6,405.4 297.7,310.9  "/><polygon style="fill:#1A237B" points="0,303.4 0,374.2 125.8,303.4  "/><polygon style="fill:#1A237B" points="0,214.7 125.8,214.7 0,143.7  "/><polygon style="fill:#BD0034" points="234.4,106.7 234.4,232.4 0,232.4 0,285.6 234.4,285.6 234.4,405.4 281.9,405.4 281.9,285.6 512,285.6    512,232.4 281.9,232.4 281.9,106.7  "/></g></svg>',
        RUSSIAN: '<svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect style="fill:#F4F4F4" height="99.6" width="512" y="106.7"/><rect style="fill:#324095" height="99.6" width="512" y="206.2"/><rect style="fill:#D81F26" height="99.6" width="512" y="305.8"/></g></svg>',
        SPANISH: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><g><rect style="fill:#B5002A" height="298.7" width="512" y="106.7"/><rect style="fill:#F4C327" height="149.4" width="512" y="181.3"/></g></svg>',
        CHINESE: '<svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect style="fill:#CB2127;" height="298.7" width="512" y="106.7"/><polygon style="fill:#F7DE28" points="49.3,214.8 58.9,185 33.6,166.5 64.9,166.4 74.7,136.7 84.4,166.4 115.7,166.5    90.4,185 100,214.8 74.7,196.4  "/><polygon style="fill:#F7DE28" points="136.6,230.9 147.2,235.1 154.5,226.4 153.7,237.8 164.3,242.1 153.2,244.9 152.4,256.2    146.3,246.6 135.3,249.3 142.6,240.5  "/><polygon style="fill:#F7DE28" points="193.8,173.6 182.6,171.7 177.2,181.7 175.6,170.4 164.4,168.4 174.6,163.4 173,152.1    181,160.3 191.2,155.3 185.9,165.4  "/><polygon style="fill:#F7DE28" points="170,224.6 173.5,213.8 164.3,207.1 175.7,207.1 179.2,196.2 182.7,207.1 194.1,207.1    184.9,213.8 188.4,224.6 179.2,218  "/><polygon style="fill:#F7DE28" points="137.1,125.7 147.5,130.4 155.3,122.1 153.9,133.4 164.2,138.3 153,140.5 151.6,151.8    146.1,141.8 134.9,144 142.6,135.6  "/></g></svg>',
        JAPANESE: '<svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect style="fill:#FFFFFF" height="298.7" width="512" y="106.7"/><path style="fill:#AD1F23" d="M256,166.4c49.5,0,89.6,40.1,89.6,89.6c0,49.5-40.1,89.6-89.6,89.6c-49.5,0-89.6-40.1-89.6-89.6   C166.4,206.5,206.5,166.4,256,166.4"/></g></svg>',
        PORTUGUESE: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><g><rect style="fill:#E91D26" height="298.7" width="332.9" x="179.1" y="106.7"/><rect style="fill:#2E6934" height="298.7" width="179.1" y="106.7"/></g></svg>',
        CROSS: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path></svg>',
        ADMIN: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M30 19l-9 9-3-3-2 2 5 5 11-11z"></path><path d="M14 24h10v-3.598c-2.101-1.225-4.885-2.066-8-2.321v-1.649c2.203-1.242 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h14v-2z"></path></svg>',
        ERP_LOGO: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 595.3 499.9" style="enable-background:new 0 0 595.3 499.9;" xml:space="preserve"> <g> <polygon id="XMLID_161_" class="st0" points="207.5,389.7 207.5,389.4 207.5,389.7 " /> <rect id="XMLID_144_" x="176.1" y="233.3" class="st1" width="11.1" height="67.4" /> <path id="XMLID_143_" class="st1" d="M280,217.1h-11.1v16.2H259v8.9h10.2v41.3c0,5.7,1.3,10.2,3.5,13.4s5.4,4.8,9.9,4.8 c2.5,0,5.1-0.3,7.6-1.3v-9.2c-1.6,0.3-2.9,0.6-4.5,0.6c-2.2,0-3.5-0.6-4.5-1.9c-1-1.3-1.3-3.5-1.3-6v-42h10.2v-8.9H280V217.1z" /> <path id="XMLID_113_" class="st1" d="M318.1,132.8c-6.7-3.8-14-4.4-20.7-2.5c-6.7,1.9-12.7,6.4-16.5,13c-2.2,3.8-3.2,7.6-3.5,11.8 v0.3c-0.3,2.9,0,6,1,8.9c1.9,6.4,6.4,12.4,13,16.2c6.7,3.8,14,4.4,20.7,2.5c2.9-1,5.7-2.2,8.3-3.8l0.3-0.3c3.2-2.2,6-5.1,7.9-8.9 c3.8-6.7,4.5-14,2.5-20.7C329.3,142.7,324.8,136.6,318.1,132.8z M323.2,139.2c1.6,1.6,2.5,3.2,3.8,5.1c-1.3-0.3-2.9-0.6-4.1-1 C323.2,141.7,323.2,140.5,323.2,139.2z M327.4,146.2c0.3,2.2,0,5.1-1,8.3c-0.3,0.6-0.6,1.6-1,2.5c-1.6-0.3-3.2-0.3-4.8-1l-1.6-0.6 c1-2.2,1.9-4.8,2.5-6.7c0.3-1.3,0.6-2.2,1-3.5C324.2,145.5,325.8,145.9,327.4,146.2z M308.9,150.9l5.1-9.2c1.9,1,4.1,1.9,6.4,2.9 c0,1,0,2.2-0.6,3.2c-0.6,2.2-1.6,4.4-2.5,6.7C314.6,153.5,311.8,152.2,308.9,150.9z M316.6,156.3c-1,1.6-1.6,3.5-2.5,5.1 c-0.6,1.3-1.6,2.5-2.5,3.8c-2.5-1.3-5.4-2.5-7.9-4.1l4.8-8.6C311.1,154.1,313.7,155.1,316.6,156.3z M307.3,150 c-2.5-1.6-4.8-3.2-7-4.8c1.6-2.2,2.9-4.1,4.5-5.7c0.6-1,1.6-1.6,2.2-2.5c1.6,1.3,3.5,2.5,5.4,3.8L307.3,150z M306.4,151.6l-4.8,8.9 c-2.5-1.6-5.1-3.2-7.3-4.4c0.6-1.3,1.3-2.5,1.9-4.1c1-1.9,1.9-3.5,3.2-5.1C301.6,148.4,303.8,150.3,306.4,151.6z M294.9,150.6 c-0.6,1.3-1.3,2.5-1.9,3.8c-2.2-1.6-4.1-2.9-5.4-4.5c0.3-1,1-1.9,1.3-2.9c1.3-2.5,2.9-4.8,4.5-6.7c0.6,1.3,1.6,2.5,2.5,3.5 c0.6,0.6,1.3,1.3,2.2,1.6C296.8,147.1,295.9,149,294.9,150.6z M292.1,156.7c-1.3,2.9-2.5,5.7-3.5,8.6l-0.3,1 c-1.3-1.3-2.5-2.2-3.8-3.5l-1.3-1.6c0.3-0.6,0.3-1.6,0.3-2.2c0.6-1.9,1.6-4.4,2.9-6.7C287.9,153.5,289.9,155.1,292.1,156.7z M290.2,165.6c0.6-2.5,1.9-5.4,3.2-7.9c2.2,1.6,4.8,2.9,7.3,4.4l-5.1,9.2c-2.2-1.3-4.1-2.5-5.7-3.8L290.2,165.6z M302.2,163 c2.9,1.6,5.4,2.9,7.9,4.1c-1.6,2.5-3.5,4.8-5.1,7l-1.3,1c-2.2-1-4.5-1.9-6.7-3.2L302.2,163z M306.7,175.1c1.9-2.2,3.8-4.8,5.4-7.3 c2.5,1,4.8,1.9,6.7,2.5c-1.6,2.2-3.2,4.1-4.8,6l-1.6,1.3c-0.6,0-1.3-0.3-1.9-0.3c-1.3-0.3-2.9-1-4.4-1.6L306.7,175.1z M313.1,166.2 c0.6-1.3,1.6-2.2,2.2-3.8c1-1.9,1.9-3.8,2.9-5.4c0.6,0.3,1.6,0.6,2.2,0.6c1.6,0.3,3.2,0.6,4.8,1c-1,2.5-1.9,5.1-3.5,7.3 c-0.6,1-1.3,1.9-1.6,2.9l-0.6-0.3C317.5,167.8,315.3,167.2,313.1,166.2z M321.6,137.3c0,1.6,0,3.5-0.6,5.4 c-1.9-0.6-3.8-1.6-5.7-2.5l2.9-5.1C319.4,135.7,320.4,136.6,321.6,137.3z M316.9,134.1l-3.2,5.1c-1.9-1-3.5-2.2-4.8-3.5 c1.6-1.3,3.2-2.5,4.5-3.2C314.6,132.8,315.6,133.5,316.9,134.1z M310.5,131.9c-1,0.6-2.2,1.6-3.2,2.5c-1.3-1-2.2-2.2-3.2-3.2 C306.4,131.2,308.3,131.6,310.5,131.9z M305.7,135.7c-0.6,0.6-1.6,1.6-2.2,2.5c-1.6,1.6-3.2,3.8-4.5,5.7l-1.9-1.3 c-1.3-1-2.2-2.2-2.9-3.2c0.6-0.6,1.3-1.6,1.9-2.2c1.9-2.2,4.1-4.1,6-5.1C303.2,133.5,304.5,134.7,305.7,135.7z M298.1,132.2l1-0.3 c-1.6,1-2.9,2.2-4.4,3.8l-1.6,1.9c-0.6-1-1.3-1.9-1.6-2.5C293.7,133.8,295.6,132.8,298.1,132.2z M282.9,144.6 c1.6-3.8,4.1-6.4,7-8.3c0.6,1,1.3,2.2,1.9,3.2c-1.9,2.2-3.5,4.4-4.8,7.3c-0.3,1-0.6,1.6-1.3,2.5 C283.5,147.1,282.2,145.2,282.9,144.6z M280.6,164.3l-0.3-1c-0.3-1.3-0.3-2.2-0.6-3.5c0.3,0.6,1,1.3,1.3,1.9 C281,162.7,280.6,163.3,280.6,164.3z M281.6,159.2c-1.3-1.6-1.9-3.2-1.9-4.5c0-2.5,0.6-5.4,1.9-7.9c0.6,1.3,1.9,2.5,3.2,3.8 c-1.3,2.9-2.2,5.4-3.2,7.9V159.2z M287,174.5c-1.6-1.9-3.2-3.8-4.5-5.7h0.3c-0.3-1.6-0.3-3.2,0-5.1l0.3,0.3 c1.3,1.3,2.9,2.9,4.8,4.1C287.3,170.3,287,172.6,287,174.5z M288.3,176.1c0.3-1.9,0.6-4.1,1-6.7c1.6,1.3,3.5,2.2,5.4,3.5l-3.2,5.4 C290.5,177.6,289.2,177,288.3,176.1z M293,179.2l3.2-5.4c2.2,1.3,4.1,2.2,6,2.9c-1.9,1.9-3.8,3.2-5.4,4.1 C295.6,180.5,294.3,179.9,293,179.2z M306.7,181.8c-2.5,0.3-4.8,0-7-0.3c1.6-1,3.2-2.5,4.8-4.1c1.9,0.6,3.8,1.3,5.7,1.9h0.6 C309.2,180.5,308,181.5,306.7,181.8z M311.8,181.1l1.6-1.3h1.9C314,180.2,312.7,180.8,311.8,181.1z M319.4,177.3 c-1,0.6-2.5,0.6-4.4,0.6l0.3-0.3c1.9-1.9,3.5-4.1,5.4-6.7c1.9,0.3,3.5,0.6,4.8,0.6C323.9,173.8,321.6,175.7,319.4,177.3z M327,169.1c-0.3,1-2.2,0.6-5.1,0c0.3-0.6,1-1.6,1.3-2.2c1.6-2.9,2.5-5.4,3.8-8.3c1.3,0,2.2,0,3.2,0 C329.9,162.4,328.9,165.9,327,169.1z M327.7,157c0.3-0.6,0.6-1.3,0.6-2.2c0.6-1.6,1-3.5,1-5.1c0.6,2.2,1,4.8,1,7.3 C329.3,157,328.6,157,327.7,157z" /> <path id="XMLID_112_" class="st1" d="M322.6,128.1c-0.9-0.5-1.8-0.9-2.9-1.3C320.6,127.1,321.6,127.6,322.6,128.1z" /> <polygon id="XMLID_111_" class="st1" points="206.3,388.1 206.3,387.7 206.2,388.1 " /> <path id="XMLID_110_" class="st1" d="M198.6,395.4c-1.3,1.3-3.2,1.9-6,1.9c-2.9,0-4.8-1.3-6.4-3.5c-1.6-2.2-2.2-5.7-2.2-9.9v-7.6 c0-4.4,0.6-7.6,2.2-9.9c1.6-2.2,3.8-3.5,6.7-3.5c2.2,0,4.1,1,5.4,2.2c1.3,1.3,1.9,3.8,2.2,7.3h5.4c0-4.4-1.3-7.9-3.5-10.5 c-2.2-2.2-5.4-3.5-9.5-3.5c-4.4,0-7.9,1.6-10.5,4.8c-2.5,3.2-3.8,7.6-3.8,13v7.6c0,5.4,1.3,9.9,3.8,13c2.5,3.2,6,4.8,10.2,4.8 c4.1,0,7.6-1,9.9-3.5c2.2-2.5,3.4-5.9,3.8-10.2h-5.4C200.5,391.6,199.9,394.1,198.6,395.4z" /> <path id="XMLID_107_" class="st1" d="M236.5,378.5c1-1.9,1.6-4.1,1.6-6.7c0-4.1-1-7.3-3.2-9.5c-2.2-2.2-5.4-3.2-9.5-3.2h-11.8v42.3 h5.4v-17.2h7.3l7.9,16.8h5.7v-0.3l-8.3-17.8C233.6,382,235.2,380.4,236.5,378.5z M225,379.5h-6.4v-16.2h6.4c4.8,0,7.3,2.9,7.3,8.3 c0,2.2-0.6,4.1-1.9,5.7C229.1,378.8,227.2,379.5,225,379.5z" /> <polygon id="XMLID_106_" class="st1" points="263.5,393.5 252.3,359.1 245.7,359.1 245.7,401.1 251.1,401.1 251.1,384.6 250.4,368.4 261.2,401.1 265.4,401.1 276.5,368.4 275.9,384.9 275.9,401.4 281.3,401.4 281.3,359.1 274.6,359.1 " /> <path id="XMLID_102_" class="st1" d="M315.3,381.7h-4.5c0,2.9-0.3,5.4-1.3,7.6l-7.3-10.8l2.9-2.5c1.6-1.3,2.9-2.9,3.5-4.1 c0.6-1.3,1-2.9,1-4.4c0-2.5-1-4.8-2.5-6.4c-1.6-1.6-3.8-2.5-6.4-2.5c-2.9,0-5.1,1-6.7,2.9c-1.6,1.9-2.5,4.5-2.5,7.6 c0,1.3,0.3,2.9,1,4.1c0.6,1.3,1.6,3.2,3.2,5.4c-2.5,2.5-4.5,4.4-5.4,6c-1,1.6-1.6,3.5-1.6,5.4c0,3.5,1,6.4,3.2,8.3 c2.2,2.2,5.1,3.2,8.6,3.2c1.6,0,3.2-0.3,4.8-1c1.6-0.6,3.2-1.3,4.1-2.5l2.2,3.2h6l-5.1-7.3C314.3,390.6,315.3,386.5,315.3,381.7z M297.5,364.2c0.6-1,1.6-1.6,2.9-1.6c1.3,0,2.2,0.3,2.9,1.3c1,1,1.3,1.9,1.3,3.2c0,1.3-0.3,2.2-0.6,3.2c-0.6,1-1.3,1.9-2.5,2.9 l-2.2,1.9c-0.6-1.3-1.3-2.5-1.9-3.5c-0.3-1-0.6-2.2-0.6-3.2C296.5,366.8,296.8,365.5,297.5,364.2z M300,397.3c-1.9,0-3.8-1-4.8-2.2 c-1-1.3-1.6-3.2-1.6-5.4c0-2.5,1.3-4.8,3.5-7l1-0.6l8.3,12.1C304.5,396.3,302.2,397.3,300,397.3z" /> <polygon id="XMLID_101_" class="st1" points="328.6,381.7 343.6,381.7 343.6,377.3 328.6,377.3 328.6,363.6 345.8,363.6 345.8,359.1 323.5,359.1 323.5,401.1 346.1,401.1 346.1,396.6 328.6,396.6 " /> <path id="XMLID_98_" class="st1" d="M375.7,378.5c1-1.9,1.6-4.1,1.6-6.7c0-4.1-1-7.3-3.2-9.5c-2.2-2.2-5.4-3.2-9.5-3.2h-11.8v42.3 h5.4v-17.2h7.3l7.9,16.8h5.7v-0.3l-8.3-17.8C372.8,382,374.4,380.4,375.7,378.5z M364.5,379.5h-6.4v-16.2h6.4 c4.8,0,7.3,2.9,7.3,8.3c0,2.2-0.6,4.1-1.9,5.7C368.7,378.8,366.8,379.5,364.5,379.5z" /> <path id="XMLID_95_" class="st1" d="M398.2,359.1h-13.3v42h5.4v-16.5h8.6c3.8-0.3,6.7-1.3,8.9-3.5c2.2-1.9,3.2-5.1,3.2-9.2 c0-3.8-1.3-7-3.5-9.2C405.2,360.4,402.1,359.1,398.2,359.1z M404,377.9c-1.3,1.6-3.2,2.2-5.4,2.2h-8.3v-16.5h8.3 c2.2,0,4.1,0.6,5.4,2.2c1.3,1.6,1.9,3.5,1.9,6C405.9,374.4,405.2,376.6,404,377.9z" /> <path id="XMLID_84_" class="st1" d="M472.4,230c-1-16.4-5.5-29.7-12.2-40.1c-5.7-8.9-12.9-15.7-20.6-20.8 c-11.5-7.7-23.9-11.7-34.4-13.8c-8.5-1.7-15.7-2.2-20.1-2.4c-2.2-5.5-6.7-15.1-14.7-25c-5.9-7.3-13.8-14.8-24.1-20.4 c-10.2-5.6-22.8-9.3-37.8-9.3c-14.8,0-26.9,3.2-36.6,8.1c-14.5,7.4-23.3,18.4-28.4,27.5c-2.5,4.5-4.1,8.5-5.2,11.4 c-0.5,0-1,0-1.5,0c-8.1,0-22.2,1.2-35.7,9.3c-6.7,4-13.1,9.8-18.2,17.8c-4.4,6.9-7.7,15.4-9.5,25.8c-1.1,0.1-2.2,0.3-3.5,0.6 c-7.8,1.6-19.6,5.4-29.7,15.4c-5,5-9.5,11.5-12.7,19.7c-3.2,8.2-5.1,18.1-5.1,30c0,15.1,3.9,27.2,9.9,36.3 c4.5,6.9,10.1,12.1,15.9,16c8.7,5.9,17.8,8.9,24.8,10.4c7,1.6,11.8,1.8,12.1,1.8l0.1,0h202.1l0.2,0c0.1,0,1.1-0.1,2.8-0.2l-0.2,0.3 c9.5,0,18.7-1.6,27.2-4.6c0.9-0.3,1.8-0.7,2.7-1c5-2,9.8-4.4,14.3-7.3c7.1-4.5,13.4-10.1,18.8-16.4c5.1-6.1,9.4-12.9,12.6-20.3 c1-2.2,1.8-4.5,2.6-6.8c2.7-8.2,4.2-16.9,4.2-26v-9.2v-7L472.4,230z M426.1,175.7c8.9,4.7,17.3,11.3,23.5,21 c6.2,9.7,10.3,22.5,10.4,40.1c0,3-0.2,5.9-0.4,8.7l-1.1,1.3c-11.6-23.9-31.4-51.8-64.9-79.3c0,0-0.7-0.5-2-1.5 C400.4,166.9,413.8,169.3,426.1,175.7z M324.5,241.5c5.1,0,8.9,1.9,11.1,5.4c0.5,0.8,0.9,1.7,1.3,2.6c0.1,0.3,0.2,0.6,0.3,0.8 c1.2,3.4,1.9,7.8,1.9,13.4v6.7c0,7.3-1.3,13-3.5,16.5c-2.5,3.5-6,5.4-11.1,5.4c-5.4,0-9.2-2.5-12.1-7.6v-35.3 C315.3,244.1,319.1,241.5,324.5,241.5z M320.7,226.9c3.2,0.6,6,1.3,7.6,1.6c0.5,1.2,1.1,2.4,1.6,3.6c-0.6,0-1.3-0.1-1.9-0.1 c-1.6,0-3.1,0.2-4.6,0.5l-2.1-5.3L320.7,226.9z M312.7,315.6v-21.3c3.5,5.1,8.9,7.6,15.6,7.6c7,0,12.4-2.5,16.2-7.9 c1.6-2.2,2.9-4.8,3.8-8c2.5,9.6,4.6,19.5,6.5,29.6H312.7z M357.8,315.6c-2.2-12.5-5-24.6-8.2-36.3c0.4-2.8,0.6-5.8,0.6-9.2v-7.3 c-0.3-10.2-1.9-18.1-5.7-23.2c-2.6-3.7-6.4-6.1-11.1-7.1c-4.8-11-9.9-21-15.3-29.8c-2.5-4.4-5.4-8.3-7.9-12.1 c7.3,1.3,14.9,2.2,22.3,3.8c3.2,0.6,6.7,1.6,9.9,2.5v0.3c1.9,0.6,3.8,1.3,5.7,1.9l1.6,0.6c14,29.3,24.3,70.9,27.1,115.7H357.8z M414,309c-1.8,0.7-3.6,1.4-5.3,2c0.1-1.7,0.2-3.4,0.3-5.1c0.1-2.4,0.3-4.8,0.3-7.1c0.8,1.4,1.4,2.8,2.1,4.2 C412.4,304.9,413.2,306.9,414,309z M417.1,307.6c-0.9-2.7-1.9-5.3-3.1-7.8c-1.1-2.4-2.4-4.8-3.8-7.1l-1-1.3c0-8.9,0-17.8-0.6-26.7 c6.7,6.7,12.1,14.1,16.4,21.9c2.3,4.3,4.2,8.7,5.8,13.1l-0.3,0.2C426.1,303.1,421.6,305.6,417.1,307.6z M448.6,281 c-0.2,0.3-0.4,0.5-0.5,0.8c-1.9-4.8-4.3-9.6-7-14.3c-8.7-15.4-21.4-30-38.1-42.8c-1.6-6-3.2-12.4-3.8-13.7 c-7.3-5.1-15.6-9.5-23.5-13c-10.8-5.1-22.2-9.5-34-12.7l-1-0.3l1.3,1.6c1.6,2.9,3.5,6,5.1,9.2c-1.3-0.6-2.9-1-4.1-1.6 c-11.8-3.8-23.8-5.1-35.9-7l-3.5-0.6l2.2,2.9c1.9,2.5,4.1,5.7,6,8.6c-1.6,0-3.5-0.3-5.4-0.3c-1.9,0-4.8-0.3-7.6-0.3 c5.4,8.3,10.5,18.1,15.3,28.6c1.3,0.3,2.5,0.3,3.8,0.6l2.7,6.9c-3.4,1.5-6.2,4-8.5,7.4l-0.6-7.6h-9.9v82.3h-87.4v-21.3 c3.5,5.1,8.9,7.6,15.6,7.6c7,0,12.4-2.5,16.2-7.9c3.8-5.1,5.7-13,5.7-23.8v-7.3c-0.3-10.2-1.9-18.1-5.7-23.2 c-3.5-5.1-9.2-7.6-16.5-7.6c-7,0-12.1,3.2-15.9,8.9l-0.6-7.6h-9.9v82.3h-17.4c-1.2,0-14-0.9-26-7.6c-6.2-3.4-12.3-8.3-16.7-15.2 c-4.5-7-7.6-16.2-7.6-29c0-14.1,2.9-24.1,7-31.4c3.1-5.5,6.9-9.6,10.9-12.6c6-4.6,12.6-7,17.7-8.2c2.2-0.5,4.1-0.8,5.6-1 c-0.9,1.2-1.5,2.8-1.5,4.6c0,1.9,0.6,3.5,1.6,4.8c1.3,1.3,2.5,1.9,4.8,1.9s3.8-0.6,4.8-1.9c1-1.3,1.6-2.9,1.6-4.8 c0-1.9-0.3-3.5-1.6-4.8c-0.4-0.4-0.8-0.7-1.2-1l0.5-4.6c1.3-11.1,4.4-19.4,8.3-25.6c5.9-9.4,13.9-14.5,21.9-17.6 c8-3,16.1-3.7,21.1-3.6c1.7,0,3.1,0.1,4,0.1c0.5,0,0.8,0.1,1,0.1l0.2,0l0,0l5.8,0.8l1.2-5.8c0.1-0.3,2.6-11.2,11-21.5 c4.3-5.2,10-10.4,17.8-14.3c7.8-3.9,17.6-6.5,30.5-6.5c12.9,0,23.2,3.1,31.7,7.8c12.7,7,21.4,17.6,26.9,26.6c1.6,2.7,2.9,5.1,4,7.3 c-8-4.9-17.9-10.5-29.2-15.9c-4.5-2.4-9-4.5-13.5-6.3l-0.1-0.1l0.1,0.1c-0.9-0.3-1.8-0.7-2.6-1l1.3,0.6c-0.6-0.3-1.3-0.6-2.2-1 c-0.7-0.3-1.4-0.6-2.2-1c1.6,0.8,3,1.7,4.4,2.5c5.4,4.5,9.2,10.5,10.8,16.8c2.2,8.3,1.6,17.8-3.2,26.1c-0.3,0.6-1,1.3-1.3,1.9h0.3 h0.3c4.1,1.3,23.5,6.7,40,13.7c2.2,1,4.8,2.2,7,3.2c6,2.9,11.8,6,17.8,9.5l1.6,1c14.1,8.9,35.9,25.5,52.3,50.7c1.5,2.3,3,4.6,4.3,7 C455.1,268.5,452.1,275.3,448.6,281z M213.9,284.8v-35.3c2.9-5.4,6.7-7.9,12.1-7.9c5.1,0,8.9,1.9,11.1,5.4 c2.2,3.8,3.5,9.2,3.5,16.8v6.7c0,7.3-1.3,13-3.5,16.5c-2.5,3.5-6,5.4-11.1,5.4C220.6,292.4,216.7,289.8,213.9,284.8z" /> </g> </svg>',
        REMOVE_ADMIN: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#0088cc" d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path><path fill="#0088cc" d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z"></path></svg>',
        GOOGLE_LOGO: '<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" width="32px" height="32px"><path fill="#ffffff" d="M 16.003906 14.0625 L 16.003906 18.265625 L 21.992188 18.265625 C 21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C 12.339844 22.636719 9.367188 19.664063 9.367188 16 C 9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C 17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L 23.410156 7.867188 C 21.457031 6.085938 18.855469 5 16.003906 5 C 9.925781 5 5 9.925781 5 16 C 5 22.074219 9.925781 27 16.003906 27 C 25.238281 27 27.277344 18.363281 26.371094 14.078125 Z"/></svg>'
    };

    return Object.freeze(obj);
});
