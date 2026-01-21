export const junctions = [
    {
        id: "junction_01",
        name: "Hutatma Chowk",
        lat: 17.6868, lng: 75.9073,
        congestion_score: 82, severity: "high",
        traffic_dna: [12, 18, 45, 78, 82, 65, 40, 30, 35, 60, 75, 80, 55, 38, 28, 20, 18, 15],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 48,
        alternate_route: "Via Gadwal Road",
        note: "Central crossroads — always jammed"
    },
    {
        id: "junction_02",
        name: "Hotgi Road Naka",
        lat: 17.6712, lng: 75.9102,
        congestion_score: 74, severity: "high",
        traffic_dna: [8, 10, 30, 65, 74, 60, 35, 25, 28, 55, 70, 72, 50, 32, 22, 15, 10, 8],
        illegal_parking_nearby: false,
        signal_green_current: 30, recommended_green: 44,
        alternate_route: "Via MIDC bypass",
        note: "Industrial belt entry — heavy trucks in morning"
    },
    {
        id: "junction_03",
        name: "Railway Station Circle",
        lat: 17.6801, lng: 75.9201,
        congestion_score: 68, severity: "moderate",
        traffic_dna: [20, 35, 55, 68, 62, 50, 40, 35, 40, 55, 65, 68, 48, 35, 28, 22, 18, 12],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 40,
        alternate_route: "Via Murarji Peth Road",
        note: "Auto stand chaos, peak hours very bad"
    },
    {
        id: "junction_04",
        name: "Bus Stand Junction",
        lat: 17.6835, lng: 75.9156,
        congestion_score: 76, severity: "high",
        traffic_dna: [15, 22, 48, 72, 76, 58, 38, 28, 32, 58, 72, 76, 52, 36, 26, 18, 14, 10],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 46,
        alternate_route: "Via Hotgi Road",
        note: "MSRTC buses block entire lane"
    },
    {
        id: "junction_05",
        name: "Siddheshwar Mandir Road",
        lat: 17.6924, lng: 75.9041,
        congestion_score: 55, severity: "moderate",
        traffic_dna: [10, 14, 28, 50, 55, 45, 32, 24, 28, 45, 55, 58, 40, 28, 20, 14, 10, 8],
        illegal_parking_nearby: false,
        signal_green_current: 30, recommended_green: 35,
        alternate_route: "Via Akkalkot Road",
        note: "Critical during Yatra season — spikes to 95+"
    },
    {
        id: "junction_06",
        name: "Gadwal Road Cross",
        lat: 17.6780, lng: 75.9010,
        congestion_score: 42, severity: "moderate",
        traffic_dna: [8, 10, 20, 38, 42, 35, 25, 18, 20, 35, 40, 42, 30, 22, 16, 10, 8, 6],
        illegal_parking_nearby: false,
        signal_green_current: 30, recommended_green: 30,
        alternate_route: "Main route — no alternate needed",
        note: "Usually clear, good alternate route"
    },
    {
        id: "junction_07",
        name: "MIDC Entry Gate",
        lat: 17.6645, lng: 75.9320,
        congestion_score: 61, severity: "moderate",
        traffic_dna: [5, 8, 18, 55, 61, 52, 30, 20, 22, 40, 55, 58, 38, 25, 16, 10, 6, 4],
        illegal_parking_nearby: false,
        signal_green_current: 30, recommended_green: 38,
        alternate_route: "Via Hotgi bypass",
        note: "Morning shift traffic spike 8-10 AM"
    },
    {
        id: "junction_08",
        name: "Dayanand College Cross",
        lat: 17.6888, lng: 75.9140,
        congestion_score: 48, severity: "moderate",
        traffic_dna: [6, 8, 15, 42, 48, 40, 28, 20, 22, 38, 45, 48, 32, 22, 15, 10, 6, 4],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 30,
        alternate_route: "Via University Road",
        note: "Gets bad during exam season"
    },
    {
        id: "junction_09",
        name: "Hotgi Road Hospital",
        lat: 17.6740, lng: 75.9085,
        congestion_score: 57, severity: "moderate",
        traffic_dna: [12, 18, 30, 52, 57, 48, 35, 28, 32, 48, 55, 58, 40, 28, 20, 14, 10, 8],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 36,
        alternate_route: "Via Gadwal Road",
        note: "Key ambulance route — needs signal priority"
    },
    {
        id: "junction_10",
        name: "Market Yard Junction",
        lat: 17.6810, lng: 75.9220,
        congestion_score: 79, severity: "high",
        traffic_dna: [10, 14, 30, 65, 79, 70, 48, 35, 40, 62, 75, 79, 55, 38, 28, 18, 12, 8],
        illegal_parking_nearby: true,
        signal_green_current: 30, recommended_green: 46,
        alternate_route: "Via Murarji Peth",
        note: "Market days bring full gridlock"
    },
];
