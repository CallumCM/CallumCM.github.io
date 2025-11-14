class Particle {

    /**
     * Creates a new fire particle
     * @param {number} x The x position of the particle on the P5 canvas
     * @param {number} y The y position of the particle on the P5 canvas
     * @param {number} temperature The initial temperature of the particle in Kelvin
     * @param {number} lifespan The lifespan of the particle in ms
     * @param {number} size The radius of the particle in pixels
     * @param {number} speed The speed at which the particle float up in px/s
     */
    constructor(x, y, temperature, lifespan, size, speed) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.birthSize = size || 80;
        this.lifespan = lifespan || 32000; // ms
        this.birthTime = millis();
        this.birthTemperature = temperature || 2700;
        this.minTemperature = 1000;
        this.birthSpeed = speed || 0.02;
        this.randomFactor = Math.random() * 0.4 + 0.6;
    }

    /**
     * Returns the relative age of the particle
     * @returns {number} Age of particle from 0-1
     */
    getAge() {
        const age = millis() - this.birthTime;
        const lifeRatio = constrain(age / this.lifespan, 0, 1);

        return lifeRatio;
    }

    getTransparency() {
        const ageRatio = this.getAge();
        const transparency = 1 - Math.pow(ageRatio, 4);
        return min(transparency * 255, 240);
    }

    getTemperature() {
        const ageRatio = this.getAge();

        // Works from x = 0 to x = 1, if you want to visualize it open Desmos and plot -3x^{2}+2x^{3}+1\left\{x\ge0\right\}\left\{x\le1\right\}
        // This is a smoothstep that INCREASES as X goes from 0-1
        const smoothstep = 3 * Math.pow(ageRatio, 2) - 2 * Math.pow(ageRatio, 3);

        const temperature = this.birthTemperature - (this.birthTemperature - this.minTemperature) * smoothstep;
        return temperature;
    }

    getColor() {
        const temperature = this.getTemperature();
        const _color = BlackBody.temperatureToRgb(temperature);
        return color(_color.r, _color.g, _color.b, this.getTransparency());
    }

    getSize() {
        const ageRatio = this.getAge();

        const TIME_SPENT_GROWING = 0.2;
        const TIME_SPENT_SHRINKING = 1 - TIME_SPENT_GROWING;

        if (ageRatio < TIME_SPENT_GROWING) {
            const growthRatio = ageRatio / TIME_SPENT_GROWING;
            return this.birthSize * growthRatio;
        }

        const shrinkRatio = (ageRatio - TIME_SPENT_GROWING) / TIME_SPENT_SHRINKING;
        const size = this.birthSize * (1 - shrinkRatio);
        return size;
    }

    getSpeed() {
        const ageRatio = this.getAge();

        // Works from x = 0 to x = 1, if you want to visualize it open Desmos and plot -3x^{2}+2x^{3}+1\left\{x\ge0\right\}\left\{x\le1\right\}
        // This is a smoothstep that INCREASES as X goes from 0-1
        const smoothstep = 3 * Math.pow(ageRatio, 2) - 2 * Math.pow(ageRatio, 3);

        const speed = this.birthSpeed * smoothstep;
        return speed;
    }

    outOfBounds(width, height) {
        const radius = this.getSize() / 2;
        return (
            this.position.x + radius < 0 ||
            this.position.x - radius > width ||
            this.position.y + radius < 0 ||
            this.position.y - radius > height
        );
    }

    move(x, y) {
        this.position.set(x, y);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    freeze() {
        this.velocity.mult(0);
        this.acceleration.mult(0);
    }

    resetLifespan() {
        this.birthTime = millis();
    }

    update() {
        const speed = this.getSpeed();
        this.velocity.set(0, -speed * deltaTime);

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity.x * deltaTime, this.velocity.y * deltaTime);
        this.acceleration.mult(0);
    }

    render() {
        this.update();
        fill(this.getColor());
        circle(this.position.x, this.position.y, this.getSize());
    }
}
