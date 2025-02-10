<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;

class OrderCreated extends Notification implements ShouldQueue
{
    use Queueable;

    private $order;
    private $total;
    private $storeName;

    public function __construct($order, $total, $storeName)
    {
        $this->order = $order;
        $this->total = $total;
        $this->storeName = $storeName;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'total' => $this->total,
            'store_name' => $this->storeName,
            'message' => "A sua encomenda {$this->order->id} no valor de {$this->total}€ foi realizada na loja {$this->storeName}.",
        ];
    }
}
