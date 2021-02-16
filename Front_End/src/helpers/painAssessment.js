import Level0 from '../assets/images/painLevels/L0.png';
import Level2 from '../assets/images/painLevels/L2.png';
import Level4 from '../assets/images/painLevels/L4.png';
import Level6 from '../assets/images/painLevels/L6.png';
import Level8 from '../assets/images/painLevels/L8.png';
import Level10 from '../assets/images/painLevels/L10.png';

export const getPainScoreImage = (score) => {
    switch (score) {
        case 0:
            return Level0;
        case 2:
            return Level2;
        case 4:
            return Level4;
        case 6:
            return Level6;
        case 8:
            return Level8;
        case 10:
            return Level10;
        default:
            return Level0;
    }
}

export const getPainScoreDescription = (score) => {
    switch (score) {
        case 0:
            return "No Hurt";
        case 2:
            return "Hurts Little Bit";
        case 4:
            return "Hurts Little More";
        case 6:
            return "Hurts Even More";
        case 8:
            return "Hurts Whole lot";
        case 10:
            return "Hurts Worst";
        default:
            return "No Hurt";
    }
}
