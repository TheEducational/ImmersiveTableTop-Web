function getPrivateIP(callback) {
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

    var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};

    pc.createDataChannel(""); // create a bogus data channel

    pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description

    pc.onicecandidate = function(ice){

      if (ice && ice.candidate && ice.candidate.candidate){

        var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)[1];

        console.log('Your IP Address:', myIP);

        pc.onicecandidate = noop;

      }

    };
}

// Handler to log an action
async function logAction(message) {
    const response = await fetch('http://192.168.0.100:5000/admin/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level: 'game', message: message })
    });

    if (!response.ok) {
        console.error("Failed to send log message:", response.statusText);
    }
}