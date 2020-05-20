import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
import matplotlib.animation as animation


class SubplotAnimation(animation.TimedAnimation):
    def __init__(self):
        fig = plt.figure()
        ax = fig.add_subplot(1, 1, 1)


        self.t = np.linspace(0, 80, 400)
        self.x = np.cos(2 * np.pi * self.t / 10.)
        self.y = np.sin(2 * np.pi * self.t / 10.)
        self.z = 10 * self.t

        ax.set_xlabel('x')
        ax.set_ylabel('y')
        #self.line1 = Line2D([], [], color='black')
        #self.line1a = Line2D([], [], color='red', linewidth=2)
        self.line1e = Line2D([], [], color='red', marker='^', markeredgecolor='r')
        #ax.add_line(self.line1)
        #ax.add_line(self.line1a)
        ax.add_line(self.line1e)
        ax.set_xlim(-1, 1)
        ax.set_ylim(-2, 2)
        ax.set_aspect('equal', 'datalim')
        animation.TimedAnimation.__init__(self, fig, interval=50, blit=True)

    def _draw_frame(self, framedata):
        i = framedata
        head = i - 1
        head_slice = (self.t > self.t[i] - 1.0) & (self.t < self.t[i])
        print(head_slice)
        #self.line1.set_data(self.x[:i], self.y[:i])
        #self.line1a.set_data(self.x[head_slice], self.y[head_slice])
        self.line1e.set_data(self.x[head], self.y[head])


        self._drawn_artists = [self.line1e]#, self.line1a]#, self.line1e]

    def new_frame_seq(self):
        return iter(range(self.t.size))

    def _init_draw(self):
        lines = [self.line1e]#, self.line1a]#, self.line1e]
        for l in lines:
            l.set_data([], [])

ani = SubplotAnimation()
# ani.save('test_sub.mp4')
plt.show()# -*- coding: utf-8 -*-

