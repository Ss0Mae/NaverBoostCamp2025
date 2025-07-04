
const fs = require('fs');
const path = require('path');

const dataModelPath = path.join(__dirname, 'data.model');
const objectsDir = path.join(__dirname, 'objects');

function parseDataModel(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.startsWith('path='));
    return lines.map(line => {
        const pathMatch = line.match(/path="([^"]+)"/);
        const objectIdMatch = line.match(/objectid="([^"]+)"/);
        return {
            path: path.join(__dirname, ...pathMatch[1].split(/[\\/]/).filter(p => p)),
            objectId: parseInt(objectIdMatch[1], 10)
        };
    });
}

function parseModelFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const [verticesStr, trianglesStr] = fileContent.split('\n\n');

    const vertices = verticesStr.split('\n').slice(1).map(line => {
        const xMatch = line.match(/x="([^"]+)"/);
        const yMatch = line.match(/y="([^"]+)"/);
        const zMatch = line.match(/z="([^"]+)"/);
        return {
            x: parseFloat(xMatch[1]),
            y: parseFloat(yMatch[1]),
            z: parseFloat(zMatch[1])
        };
    });

    const triangles = trianglesStr.split('\n').slice(1).filter(line => line).map(line => {
        const v1Match = line.match(/v1="([^"]+)"/);
        const v2Match = line.match(/v2="([^"]+)"/);
        const v3Match = line.match(/v3="([^"]+)"/);
        return {
            v1: parseInt(v1Match[1], 10),
            v2: parseInt(v2Match[1], 10),
            v3: parseInt(v3Match[1], 10)
        };
    });

    return { vertices, triangles };
}

function calculateTriangleMetrics(triangle, vertices) {
    const p1 = vertices[triangle.v1];
    const p2 = vertices[triangle.v2];
    const p3 = vertices[triangle.v3];

    const xLength = Math.max(p1.x, p2.x, p3.x) - Math.min(p1.x, p2.x, p3.x);
    const yLength = Math.max(p1.y, p2.y, p3.y) - Math.min(p1.y, p2.y, p3.y);
    const zLength = Math.max(p1.z, p2.z, p3.z) - Math.min(p1.z, p2.z, p3.z);

    const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
    const b = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2) + Math.pow(p3.z - p2.z, 2));
    const c = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2) + Math.pow(p1.z - p3.z, 2));
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    return { xLength, yLength, zLength, area };
}

async function showProgressBar() {
    const total = 5000;
    const interval = 500;
    let elapsed = 0;

    console.log('Analyzing...');
    const intervalId = setInterval(() => {
        elapsed += interval;
        const progress = Math.floor((elapsed / total) * 100);
        const barLength = 20;
        const filledLength = Math.round((barLength * progress) / 100);
        const bar = '▓'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        process.stdout.write(`\r${bar} ${progress}%`);
    }, interval);

    await new Promise(resolve => setTimeout(resolve, total));
    clearInterval(intervalId);
    process.stdout.write('\r' + ' '.repeat(30) + '\r'); // Clear the line
    console.log('Analysis complete.');
}

async function main() {
    await showProgressBar();

    const models = parseDataModel(dataModelPath);

    let maxX = { value: -1, objectId: -1 };
    let maxY = { value: -1, objectId: -1 };
    let maxZ = { value: -1, objectId: -1 };
    let maxArea = { value: -1, objectId: -1 };

    for (const model of models) {
        const { vertices, triangles } = parseModelFile(model.path);
        for (const triangle of triangles) {
            const metrics = calculateTriangleMetrics(triangle, vertices);
            if (metrics.xLength > maxX.value) {
                maxX = { value: metrics.xLength, objectId: model.objectId };
            }
            if (metrics.yLength > maxY.value) {
                maxY = { value: metrics.yLength, objectId: model.objectId };
            }
            if (metrics.zLength > maxZ.value) {
                maxZ = { value: metrics.zLength, objectId: model.objectId };
            }
            if (metrics.area > maxArea.value) {
                maxArea = { value: metrics.area, objectId: model.objectId };
            }
        }
    }

    console.log(`X 축으로 가장 긴 값을 포함하는 것의 objectid: ${maxX.objectId}`);
    console.log(`Y 축으로 가장 긴 값을 포함하는 것의 objectid: ${maxY.objectId}`);
    console.log(`Z 축으로 가장 긴 값을 포함하는 것의 objectid: ${maxZ.objectId}`);
    console.log(`가장 면적이 넓은 것의 objectid: ${maxArea.objectId}`);
}

main();
