const { PerformanceObserver, performance } = require('perf_hooks');

module.exports = class Utils {

    /**
     * Prints the time elapsed by func
     *
     * @param func
     * @param async
     * @returns {number}
     */
    static async benchmark(func,async = false){
        const timeBefore = performance.now();
        if(async) await func(); else func();
        const timeAfter = performance.now();
        const cost = timeAfter-timeBefore;

        console.log(`Action took ${cost} milliseconds`);
        return cost;
    }

};