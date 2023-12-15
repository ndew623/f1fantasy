export function posToPoints(x) {
    let result = 0;
    switch (x) {
        case 1:
            result = 25;
            break;
        case 2:
            result = 18;
            break;
        case 3:
            result = 15;
            break;
        case 4:
            result = 12;
            break;
        case 5:
            result = 10;
            break;
        case 6:
            result = 8;
            break;
        case 7:
            result = 6;
            break;
        case 8:
            result = 4;
            break;
        case 9:
            result = 2;
            break;
        case 10:
            result = 1;
            break;
        default:
            result = 0;//could have fractional points to allow 11th or 12th to be weighted higher than 18th for example, would round down when displaying points
            break;
    }
    return result;
}